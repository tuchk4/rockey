## 0.12.0 (May 12, 2017)

#### :house: Internal

* `rockey-css-parse`

  * Added `rockey-css-parse` package. Very fast way to parse dynamic CSS (with JS functions inside) and generate CSS string according to prop.
  * Added new benchmarks - for nested CSS syntax `npm run bench:nested` and for native CSS syntax `npm run bench:native`

* `rockey`

  * Added *vendorPrefix* and *validateCSSRule* for development environment.
  * Refactor and greatly increase perfomance
  * New fast approach to work with StyleSheets in runtime
