#include "text_shaper.h"

#include <limits>

#include <ft2build.h>
#include FT_FREETYPE_H

namespace DynamicFont {

    namespace {
        uint32_t utf8_next(const char* s, int* bytes) {
            unsigned char c = (unsigned char)*s;
            if (c < 0x80) { *bytes = 1; return c; }
            int n = 0;
            uint32_t cp = 0;
            if ((c & 0xE0) == 0xC0) { n = 2; cp = c & 0x1F; }
            else if ((c & 0xF0) == 0xE0) { n = 3; cp = c & 0x0F; }
            else if ((c & 0xF8) == 0xF0) { n = 4; cp = c & 0x07; }
            else { *bytes = 1; return 0xFFFD; }
            for (int i = 1; i < n; i++) {
                unsigned char cc = (unsigned char)s[i];
                if ((cc & 0xC0) != 0x80) { *bytes = 1; return 0xFFFD; }
                cp = (cp << 6) | (cc & 0x3F);
            }
            *bytes = n;
            return cp;
        }
    }

    TextShaper::TextShaper(const Atlas &atlas)
        : m_Glyphs(atlas.GetGlyphs()),
        m_AtlasFont(atlas.GetFont()) {
    }

    TextShaper::~TextShaper() {
    }

    ShapedGlyphs TextShaper::ShapeUtf8(span_const<char> text) {
        FT_Face face = m_AtlasFont->face;
        ShapedGlyphs glyphs;
        glyphs.reserve(text.size());
        const char* p = text.data();
        const char* end = p + text.size();
        while (p < end && *p) {
            int bytes = 1;
            uint32_t cp = utf8_next(p, &bytes);
            p += bytes;
            if (cp == '\n' || cp == '\r') {
                // newline handling stays with the calling layout code
            }
            FT_UInt gi = FT_Get_Char_Index(face, cp);
            if (gi == 0 && cp != 0) {
                // try the .notdef -> unknown glyph from the atlas below
            }
            ShapedGlyph glyph{};
            glyph.info = GetAtlasGlyph(gi);
            FT_Error err = FT_Load_Glyph(face, gi, FT_LOAD_DEFAULT);
            if (err == 0) {
                glyph.xAdvance = (float)face->glyph->advance.x / 64.0f;
                glyph.yAdvance = (float)face->glyph->advance.y / 64.0f;
            } else {
                glyph.xAdvance = (float)(glyph.info.width > 0 ? glyph.info.width : 8);
            }
            glyph.xOffset = 0.0f;
            glyph.yOffset = 0.0f;
            glyphs.push_back(glyph);
        }
        return glyphs;
    }

    ShapedGlyphs TextShaper::ShapeUtf32(span_const<char32_t> text) {
        std::vector<uint32_t> codepoints(text.begin(), text.end());
        auto span = make_span<uint32_t>(codepoints.data(), codepoints.size());
        return ShapeUnicode(span);
    }

    ShapedGlyphs TextShaper::ShapeUnicode(span_const<uint32_t> codepoints) {
        FT_Face face = m_AtlasFont->face;
        ShapedGlyphs glyphs;
        glyphs.reserve(codepoints.size());
        for (uint32_t cp : codepoints) {
            FT_UInt gi = FT_Get_Char_Index(face, cp);
            ShapedGlyph glyph{};
            glyph.info = GetAtlasGlyph(gi);
            FT_Error err = FT_Load_Glyph(face, gi, FT_LOAD_DEFAULT);
            if (err == 0) {
                glyph.xAdvance = (float)face->glyph->advance.x / 64.0f;
                glyph.yAdvance = (float)face->glyph->advance.y / 64.0f;
            } else {
                glyph.xAdvance = (float)(glyph.info.width > 0 ? glyph.info.width : 8);
            }
            glyph.xOffset = 0.0f;
            glyph.yOffset = 0.0f;
            glyphs.push_back(glyph);
        }
        return glyphs;
    }

    FontMetrics TextShaper::GetFontMetrics() const {
        return m_AtlasFont->GetMetrics();
    }

    TextMeasurement TextShaper::Measure(const ShapedGlyphs &glyphs) {
        if (glyphs.empty())
            return TextMeasurement{};

        float minY = std::numeric_limits<float>::max();
        float maxY = std::numeric_limits<float>::min();
        float minX = std::numeric_limits<float>::max();
        float maxX = std::numeric_limits<float>::min();
        float cursorX = 0.0f;
        float cursorY = 0.0f;
        for (const auto &glyph : glyphs) {
            float x = cursorX + glyph.xOffset + (float)glyph.info.bearingX;
            float y = cursorY + glyph.yOffset - (float)glyph.info.bearingY;

            minX = std::min(minX, x);
            maxX = std::max(maxX, x + (float)glyph.info.width);
            minY = std::min(minY, y);
            maxY = std::max(maxY, y + (float)glyph.info.height);

            cursorX += glyph.xAdvance;
            cursorY += glyph.yAdvance;
        }

        TextMeasurement r;

        r.width = maxX - minX;
        r.height = maxY - minY;
        r.xOffset = minX;
        r.yOffset = minY;
        r.xAdvance = cursorX;
        r.yAdvance = cursorY;

        return r;
    }

    Glyph TextShaper::GetAtlasGlyph(uint32_t index) {
        const auto &glyphs = m_Glyphs.Data();
        const auto it = glyphs.find(index);
        return it != glyphs.end() ? it->second : m_Glyphs.GetUnknownGlyph();
    }
}
