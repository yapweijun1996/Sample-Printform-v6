# Sample Printform v6

**Generate paginated, print-friendly HTML layouts with repeatable headers, footers, and flexible page breaks.**

---

## Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Installation](#installation)
- [Configuration](#configuration)
- [Usage Example](#usage-example)
- [Customization](#customization)
- [Contributing](#contributing)
- [License](#license)

---

## Overview

Sample Printform v6 takes plain HTML tables wrapped in a `<div class="printform">` and transforms them into paginated content suitable for printing. It automatically repeats headers, footers, and fills remaining page space with dummy rows or spacers, respecting your per-form configuration.

## Features

- Multi-page print layout with automatic page breaks
- Per-form page size (width & height) configuration
- Repeatable elements: header, document info, row header, footer, footer logo
- Insert dummy rows/spacers to fill pages exactly
- Custom dummy-row/item markup via a `<template>` block
- Inter-form page breaks when multiple `.printform` blocks exist
- Zero dependencies, pure vanilla JavaScript

## Installation

1. Clone the repo:
   ```bash
   git clone https://github.com/your-username/Sample-Printform-v6.git
   cd Sample-Printform-v6
   ```
2. Open `index.html` in your browser or integrate into your app.
3. Ensure `js/printform.js` is included at the bottom of `<body>`:
   ```html
   <script src="./js/printform.js"></script>
   ```

## Configuration

Wrap each print section in:

```html
<div class="paper_width printform"
     data-papersize-width="750"              <!-- page width in px -->
     data-papersize-height="1050"            <!-- page height in px -->
     data-height-of-dummy-row-item="27"       <!-- dummy-row line height -->
     data-repeat-header="y"                   <!-- repeat header every page? y/n -->
     data-repeat-docinfo="y"
     data-repeat-rowheader="y"
     data-repeat-footer="n"
     data-repeat-footer-logo="y"
     data-insert-dummy-row-item-while-format-table="y"
     data-insert-dummy-row-while-format-table="y"
     data-insert-footer-spacer-while-format-table="y"
     data-insert-footer-spacer-with-dummy-row-item-while-format-table="y"
>
  <!-- optional: template override for dummy-row markup -->
  <template class="custom-dummy-row-item-content">
    <!-- your <tr>…</tr> rows here -->
  </template>

  <!-- your tables: .pheader, .pdocinfo, .prowheader, .prowitem, .pfooter, .pfooter_logo -->
</div>
```

### Data Attributes Reference

| Attribute                                                         | Type | Default | Description                                      |
|-------------------------------------------------------------------|------|---------|--------------------------------------------------|
| `data-papersize-width`                                            | px   | 750     | Page width                                      |
| `data-papersize-height`                                           | px   | 1050    | Page height                                     |
| `data-height-of-dummy-row-item`                                   | px   | 18      | Height of a dummy row item                      |
| `data-repeat-header`, `-docinfo`, `-rowheader`, `-footer`, `-footer-logo` | y/n | y/n     | Toggle repetition of elements each page         |
| `data-insert-dummy-row-item-while-format-table`                   | y/n  | y       | Fill bottom with dummy rows                     |
| `data-insert-dummy-row-while-format-table`                        | y/n  | n       | Fill bottom with full dummy table rows          |
| `data-insert-footer-spacer-while-format-table`                    | y/n  | y       | Insert footer spacer div                        |
| `data-insert-footer-spacer-with-dummy-row-item-while-format-table`| y/n  | y       | Spacer + dummy rows                             |
| `data-custom-dummy-row-item-content`                              | HTML | ""     | Inline fallback markup (use `<template>` instead) |

## Usage Example

1. Define a `.printform` block:
   ```html
   <div class="paper_width printform" data-papersize-width="800" data-papersize-height="1100">
     <template class="custom-dummy-row-item-content">
       <tr><td>Custom filler row</td></tr>
     </template>
     <table class="paper_width pheader">…</table>
     <table class="paper_width pdocinfo">…</table>
     <table class="paper_width prowheader">…</table>
     <table class="paper_width prowitem">…</table>
     <table class="paper_width pfooter">…</table>
     <table class="paper_width pfooter_logo">…</table>
   </div>
   ```
2. `printform.js` auto-processes on `window.onload`. For manual trigger:
   ```js
   window.processAllPrintForms();
   ```

## Customization

- Override dummy rows via `<template class="custom-dummy-row-item-content">…</template>`
- Tweak per-page flags with `data-…` attributes
- Customize CSS (e.g. `.paper_width { width: XXXpx; }`)

## Contributing

1. Fork the repo
2. Create a feature branch (`git checkout -b feature/YourFeature`)
3. Commit your changes (`git commit -am 'Add feature'`)
4. Push to the branch (`git push origin feature/YourFeature`)
5. Open a Pull Request

Please follow existing code style and include examples/tests for new features.

## License

This project is open source under the [MIT License](LICENSE). 