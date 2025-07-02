/**
 * plugins/webfontloader.js
 *
 * webfontloader documentation: https://github.com/typekit/webfontloader
 */

export async function loadFonts() {
  const webFontLoader = await import(
    /* webpackChunkName: "webfontloader" */ "webfontloader"
  )

  webFontLoader.load({
    // google: {
    //   families: ['Poppins:100,300,400,500,700,900&display=swap'],
    // },
    google: {
      api: "https://fonts.googleapis.com/css2",
      families: ["Inter:wght@300;400;500;600;700;900&display=swap"],
    },
  })
}
