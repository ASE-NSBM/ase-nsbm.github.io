/** @type {import('stylelint').Config} */
export default {
  extends: ['stylelint-config-recommended', 'stylelint-config-html'],
  rules: {
    'at-rule-no-unknown': null,
    'at-rule-no-deprecated': null,
    'selector-pseudo-class-no-unknown': [
      true,
      {
        ignorePseudoClasses: ['global']
      }
    ],
    'no-descending-specificity': null,
    'property-no-unknown': [
      true,
      {
        ignoreProperties: ['group']
      }
    ],
    'block-no-empty': null
  }
}
