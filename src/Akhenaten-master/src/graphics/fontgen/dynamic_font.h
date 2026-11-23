#pragma once

#include <cstdint>
#include <vector>
#include <variant>
#include <memory>

#include "core/custom_span.hpp"

struct FT_FaceRec_;

namespace DynamicFont {
    struct Pixels { int value; };
    struct Points { int value; };
    using FontSize = std::variant<Pixels, Points>;

    struct FontMetrics {
        int ascender;  // Distance from baseline to top of glyph (positive value)
        int descender; // Distance from baseline to bottom of glyph (negative value)
        int height;    // Distance from baseline to the next line's baseline (ascender - descender + linegap)
    };

    class Font {
    public:
        explicit Font(const char *path);
        explicit Font(span_const<uint8_t> data);
        Font(Font &&) noexcept;
        ~Font();

        /** Process-wide shared face for a font path. The per-codepoint Atlas loop
         *  in fill_font_packer creates/destroys an Atlas (and with it a Font → a
         *  full FT_New_Face open of a multi-MB variable font) per glyph; reusing
         *  one face turns that storm into a single open per path. */
        static std::shared_ptr<Font> shared(const char *path);

        void SetSize(const FontSize &size);
        uint32_t GetGlyphIndex(uint32_t codepoint) const;

        FontMetrics GetMetrics() const;

        FT_FaceRec_ *face = nullptr;

    private:
        void SetSizeInPixels(Pixels size);
        void SetSizeInPoints(Points size);


        std::vector<uint8_t> fontData = {};
    };
}

