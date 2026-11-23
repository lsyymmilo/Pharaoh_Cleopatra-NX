#pragma once

#include "dynamic_atlas.h"
#include "core/custom_span.hpp"
#include <vector>

/**
 * @file text_shaper.h
 * @brief Text shaping and layout for the dynamic font system.
 *
 * Switch-port edition: HarfBuzz is replaced by a simple FreeType-based
 * passthrough shaper (per-character glyph selection + advance from the
 * font's hmtx table). Sufficient for Latin and CJK text; complex script
 * shaping (Arabic/Indic) is not supported in this build.
 */

namespace DynamicFont {
    struct ShapedGlyph {
        float xOffset;   ///< Horizontal offset from the current pen position
        float yOffset;   ///< Vertical offset from the baseline
        float xAdvance;  ///< Horizontal advance to move the pen
        float yAdvance;  ///< Vertical advance (typically 0 for LTR text)

        Glyph info;      ///< Glyph information from the atlas
    };

    using ShapedGlyphs = std::vector<ShapedGlyph>;

    struct TextMeasurement {
        float width, height;
        float xOffset, yOffset;
        float xAdvance, yAdvance;
    };

    class TextShaper {
    public:
        explicit TextShaper(const Atlas &atlas);
        ~TextShaper();

        ShapedGlyphs ShapeAscii(span_const<char> text) {
            return ShapeUtf8(text);
        }

        ShapedGlyphs ShapeUtf8(span_const<char> text);
        ShapedGlyphs ShapeUtf32(span_const<char32_t> text);
        ShapedGlyphs ShapeUnicode(span_const<uint32_t> codepoints);

        FontMetrics GetFontMetrics() const;

        static TextMeasurement Measure(const ShapedGlyphs &);

    private:
        Glyph GetAtlasGlyph(uint32_t glyphIndex);

        Atlas::Glyphs m_Glyphs;
        std::shared_ptr<const Font> m_AtlasFont;
    };
} // namespace DynamicFont
