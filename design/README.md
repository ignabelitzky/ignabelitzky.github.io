# Phosphor social preview

`social-preview-phosphor.svg` is the editable 1200 × 630 source for
`src/assets/social-preview-phosphor.png`. It uses the exact primary badge geometry
from the owner-provided Phosphor Essential Kit v1.0, with its original fills and ring.
The dark background and restrained circuit decoration adapt the supplied YouTube
banner to a social-card aspect ratio. They do not alter the badge.

The name uses the kit's Inter SemiBold and the subtitle uses Inter Regular. Both
are converted to paths, so rasterization does not depend on installed fonts.
The applicable Inter OFL is retained in `Inter-OFL.txt`.

Export with Inkscape:

```sh
inkscape design/social-preview-phosphor.svg --export-type=png --export-filename=src/assets/social-preview-phosphor.png
```

Astro processes the PNG and creates a content-hashed URL. Both languages use the
owner-requested name and “Software Developer” identity. The page title and summary
remain localized. Header logos, favicon, site layout and consent behavior are preserved.
