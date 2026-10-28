# Image credits

## Homepage hero (Stage 1)

- Photographer: [Didier Bn (@didierdbn)](https://unsplash.com/@didierdbn)
- Photo: [Aerial view of green field — “Football like no place else”](https://unsplash.com/photos/aerial-view-of-green-field-g1x5RZqaNBw)
- Source image: `https://images.unsplash.com/photo-1625923541779-630119dfa15d`
- License: [Unsplash License](https://unsplash.com/license). The photo's source page identifies it as free under this license.
- Retrieved: 2026-10-21.
- Usage: illustrative sports-facility photography; not identified as an Arena Grid project or a bookable venue.
- Processing: cropped and encoded to WebP through the source image service, then downloaded into `public/images/home/`. The application serves only these local hero files.

| File | Dimensions | Bytes | Encoding / crop |
| --- | --- | ---: | --- |
| `arena-field-wide.webp` | 1920 × 1280 | 329660 | WebP q48, focal point 0.5 / 0.72 |
| `arena-field-medium.webp` | 1280 × 854 | 222900 | WebP q55, focal point 0.5 / 0.72 |
| `arena-field-mobile.webp` | 768 × 1152 | 176604 | WebP q58, focal point 0.5 / 0.56 |
| `arena-field-mobile-small.webp` | 480 × 720 | 74280 | WebP q60, focal point 0.5 / 0.56 |

Download URL format (substitute the dimensions, quality and vertical focal point from the table):

```text
https://images.unsplash.com/photo-1625923541779-630119dfa15d?fm=webp&fit=crop&crop=focalpoint&fp-x=0.5&fp-y={y}&w={width}&h={height}&q={quality}
```

## Homepage sections (Stage 2)

The original below-the-fold image URLs had no photographer/source-page metadata, included a duplicated badminton/padel image, and placed generic stock photographs beside named projects. The redesign retains the credited Stage 1 photograph for football discovery and introduces the following four photographs. Named project summaries are now text-only. Existing shared content and images on other routes are unchanged.

All source pages below identify these photographs as free under the [Unsplash License](https://unsplash.com/license). Retrieved on 2026-10-21. Photography is illustrative: these are not identified as Arena Grid installations or customer venues.

| Subject / local prefix | Photographer | Source page | Source image |
| --- | --- | --- | --- |
| Football / `football` | Didier Bn | [Aerial view of green field](https://unsplash.com/photos/aerial-view-of-green-field-g1x5RZqaNBw) | `photo-1625923541779-630119dfa15d` |
| Basketball / `basketball` | CHUTTERSNAP | [Aerial photography of basketball court](https://unsplash.com/photos/aerial-photography-of-basketball-court-u-Qgv9qY48Q) | `photo-1531273753788-0c049778dd13` |
| Tennis / `tennis` | Tim Chow | [A tennis court with a net on it](https://unsplash.com/photos/a-tennis-court-with-a-net-on-it-0PRyJ8acqbw) | `photo-1567220702341-8f7ebc3d6aca` |
| Athletics / `athletics` | Charan S | [An aerial view of a stadium with a red track](https://unsplash.com/photos/an-aerial-view-of-a-stadium-with-a-red-track-ILca0r6Orro) | `photo-1731589835170-5a78fb15e3f5` |
| Community / `community` | Matteo Paganelli | [People playing basketball at court during sunset](https://unsplash.com/photos/people-playing-basketball-at-court-during-sunset-yw2P3ONJO6g) | `photo-1448542146881-1d78dfb2f674` |

All files are in `public/images/home/`, cropped and encoded through the source image service, then downloaded locally. No photo CDN is needed by the homepage at runtime.

| File | Dimensions | Bytes | WebP quality / focal point x,y |
| --- | --- | ---: | --- |
| `football-640.webp` | 640 × 480 | 67644 | 58 / 0.5,0.72 |
| `football-960.webp` | 960 × 720 | 143966 | 58 / 0.5,0.72 |
| `basketball-640.webp` | 640 × 480 | 32318 | 68 / 0.64,0.5 |
| `basketball-960.webp` | 960 × 720 | 95402 | 68 / 0.64,0.5 |
| `tennis-640.webp` | 640 × 480 | 67790 | 68 / 0.5,0.5 |
| `tennis-960.webp` | 960 × 720 | 152266 | 68 / 0.5,0.5 |
| `athletics-640.webp` | 640 × 480 | 89068 | 62 / 0.3,0.42 |
| `athletics-960.webp` | 960 × 720 | 189740 | 62 / 0.3,0.42 |
| `community-640.webp` | 640 × 480 | 65872 | 66 / 0.36,0.5 |
| `community-1280.webp` | 1280 × 960 | 242714 | 66 / 0.36,0.5 |

Reproducible download URL format:

```text
https://images.unsplash.com/{source-image}?fm=webp&fit=crop&crop=focalpoint&fp-x={x}&fp-y={y}&w={width}&h={height}&q={quality}
```

Each below-the-fold image has responsive `srcset`/`sizes`, explicit dimensions, descriptive alt text, lazy loading and asynchronous decoding. Credits here cover the homepage assets; the legacy images on other pages have not been reassessed in this stage.

## Stage 3 hero delivery and social card

The same Didier Bn photograph and Unsplash license documented above are used for these local variants. Retrieved on 2026-10-21; the two mobile AVIF variants were recompressed on 2026-10-22. AVIF versions preserve the existing crops, with the Stage 1 WebP files retained as fallbacks. The JPEG is a social sharing image, not an additional on-page photograph.

| File in `public/images/home/` | Dimensions | Bytes | Format / quality / focal point x,y |
| --- | --- | ---: | --- |
| `arena-field-wide.avif` | 1920 x 1280 | 182307 | AVIF / 45 / 0.5,0.72 |
| `arena-field-medium.avif` | 1280 x 854 | 111638 | AVIF / 48 / 0.5,0.72 |
| `arena-field-mobile.avif` | 768 x 1152 | 56737 | AVIF / 35 / 0.5,0.56 |
| `arena-field-mobile-small.avif` | 480 x 720 | 31871 | AVIF / 40 / 0.5,0.56 |
| `arena-social.jpg` | 1200 x 630 | 195728 | JPEG / 78 / 0.5,0.72 |

Download format: the same source-image URL above with `fm=avif` or `fm=jpg`, and the dimensions, quality and focal point in this table. The larger mobile hero is 67.9% smaller than its WebP fallback. `public/favicon.svg` is a code-drawn rendering of the existing AG brand monogram, using the existing brand colors; it introduces no third-party imagery.

### Stage 3 responsive section variants

These AVIF variants use the same five credited photographers, source images, Unsplash license and focal crops from Stage 2. They were downloaded on 2026-10-21. The existing WebP variants remain fallbacks. The intermediate 768px sports images avoid downloading a 960px image for typical mobile display densities.

| File in `public/images/home/` | Dimensions | Bytes | AVIF quality / focal point x,y |
| --- | --- | ---: | --- |
| `football-640.avif` | 640 x 480 | 37621 | 48 / 0.5,0.72 |
| `football-768.avif` | 768 x 576 | 50341 | 48 / 0.5,0.72 |
| `football-960.avif` | 960 x 720 | 71258 | 48 / 0.5,0.72 |
| `basketball-640.avif` | 640 x 480 | 15157 | 55 / 0.64,0.5 |
| `basketball-768.avif` | 768 x 576 | 18321 | 55 / 0.64,0.5 |
| `basketball-960.avif` | 960 x 720 | 28144 | 55 / 0.64,0.5 |
| `tennis-640.avif` | 640 x 480 | 42180 | 55 / 0.5,0.5 |
| `tennis-768.avif` | 768 x 576 | 54610 | 55 / 0.5,0.5 |
| `tennis-960.avif` | 960 x 720 | 76706 | 55 / 0.5,0.5 |
| `athletics-640.avif` | 640 x 480 | 41790 | 50 / 0.3,0.42 |
| `athletics-768.avif` | 768 x 576 | 57617 | 50 / 0.3,0.42 |
| `athletics-960.avif` | 960 x 720 | 85482 | 50 / 0.3,0.42 |
| `community-640.avif` | 640 x 480 | 40251 | 55 / 0.36,0.5 |
| `community-1280.avif` | 1280 x 960 | 141667 | 55 / 0.36,0.5 |

## Products catalogue images
- Indoor sports illustrative image: https://images.unsplash.com/photo-1546519638-68e109498ffc (Unsplash); saved locally as public/images/products/indoor-court.jpg. Shows a basketball hoop, not a flooring specification or an Arena Grid project.
- Turf: existing Didier Bn / Unsplash photo-1625923541779-630119dfa15d; tighter focal crop centred at 50%, 72%, zoom 1.6; public/images/products/turf.jpg. Existing source/license credit above applies.
- Updated indoor flooring card: Maria Orlova, Pexels, https://www.pexels.com/photo/interior-of-indoors-basketball-court-in-sports-center-4946389/ ; local file public/images/products/indoor-flooring.jpg. Downloaded under the Pexels license, 1200px wide. Wooden floor and court markings, bottom-aligned crop. Replaces the illustrative hoop image in the card.


## Arena Grid Infra official logo

- Source: user-supplied `logo.jpeg`, provided as the website logo.
- Local asset: `public/images/brand/arena-grid-logo.jpeg`.
- Original JPEG preserved unchanged. Header, mobile navigation and footer display the upper emblem through an SVG viewport; adjacent brand text supplies the accessible name.


## Sample catalogue content (2026-10-28)

- Five sample products and sports reuse the existing credited images: `products/turf.jpg`, `home/tennis-960.webp`, `home/basketball-960.webp`, `products/indoor-flooring.jpg`, and `home/athletics-960.webp`. Existing photographer/source/license entries above apply.
- `public/images/samples/*-before.svg` are original code-drawn site-planning diagrams, explicitly labeled DEMO and illustration only.
- Demo project After images are stock references; they are not photographs of the Before site or evidence of Arena Grid client work. Project titles/descriptions disclose this.
- No competitor images, project histories, testimonials or certification claims were copied.
