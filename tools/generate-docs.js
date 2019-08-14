/**
 * Auto-generate documentation from the component's propTypes.
 * Adapted from Material-UI's PropTypeDescription component:
 *  https://github.com/callemall/material-ui/blob/82482758573dc714b210529dcf092dab904db0ba/docs/src/app/components/PropTypeDescription.js
 * (c) Call-Em-All
 */

const fs = require('fs');
const { parse } = require('react-docgen');
const parseDoctrine = require('doctrine').parse;

function generatePropType(type) {
  switch (type.name) {
    case 'func':
      return 'function';
    case 'custom':
      return type.raw;
    case 'instanceOf':
      return type.value;
    case 'enum': {
      const values = type.value.map((v) => v.value).join('<br>&nbsp;');
      return `enum:<br>&nbsp;${values}<br>`;
    }
    case 'union': {
      const values = type.value.map(generatePropType).join('<br>&nbsp;');
      return `one of:<br>&nbsp;${values}<br>`;
    }
    default:
      return type.name;
  }
}

function generateDescription(parsed, tags, type) {
  // two new lines result in a newline in the table. all other new lines
  // must be eliminated to prevent markdown mayhem.
  const jsDocText = parsed.description.replace(/\n\n/g, '<br>').replace(/\n/g, ' ');

  if (parsed.tags.some((tag) => tag.title === 'ignore')) {
    return null;
  }
  let signature = '';

  if (type.name === 'func' && parsed.tags.length > 0) {
    const parsedArgs = tags.param || [];
    const parsedReturns = (tags.returns && tags.returns[0]) || {
      type: { name: 'void' },
    };

    signature += '<br><br>**Signature:**<br>`function(';
    signature += parsedArgs
      .filter((tag) => tag.name.indexOf('.') === -1)
      .map((tag) => `${tag.name}: ${tag.type.name}`)
      .join(', ');
    signature += `) => ${parsedReturns.type.name}\`<br>`;
    signature += parsedArgs
      .map((tag) => `*${tag.name}:* ${tag.description}`)
      .join('<br>');
    if (parsedReturns.description) {
      signature += `<br> *returns* (${parsedReturns.type.name}): ${parsedReturns.description}`;
    }
  }

  return `${jsDocText}${signature}`;
}

function generateRow(prop) {
  const parsed = parseDoctrine(prop.description);

  const parsedTags = {};
  parsed.tags.forEach((tag) => {
    if (!parsedTags[tag.title]) {
      parsedTags[tag.title] = [];
    }
    // Remove new lines from tag descriptions to avoid markdown errors.
    if (tag.description) {
      // eslint-disable-next-line no-param-reassign
      tag.description = tag.description.replace(/\n/g, ' ');
    }
    parsedTags[tag.title].push(tag);
  });

  let defaultValue = '';
  if (parsedTags.default && parsedTags.default.length > 0) {
    defaultValue = parsedTags.default[0].description;
  } else if (prop.defaultValue) {
    defaultValue = prop.defaultValue.value.replace(/\n/g, '');
  }

  return {
    type: generatePropType(prop.type),
    default: defaultValue,
    description: generateDescription(parsed, parsedTags, prop.type),
  };
}

function render(code) {
  const componentInfo = parse(code);

  const componentDescription = componentInfo.description
    ? `\n${componentInfo.description}\n\n`
    : '';
  const header = '| Name | Type | Default | Description |';
  let text = `${componentDescription}${header}\n|:-----|:-----|:-----|:-----|\n`;

  Object.keys(componentInfo.props).forEach((key) => {
    const prop = componentInfo.props[key];

    const row = generateRow(prop);

    if (row.description === null) return;

    let required = '';
    if (prop.required) {
      required += ' _(required)_';
    }

    text += `| ${key}${required} | ${row.type} | ${row.default} | ${row.description} |\n`;
  });

  return text;
}

function gen(file) {
  const source = fs.readFileSync(file, 'utf8')
    // react-docgen doesn't pick up on "import * as React" for some reason, so
    // hack around that
    .replace('* as React', 'React');
  return render(source);
}

/* eslint-disable no-console */
console.log('### AutoComplete');
console.log(gen('src/index.js'));
console.log('### Completion');
console.log(gen('src/Completion.js'));
/* eslint-enable no-console */
