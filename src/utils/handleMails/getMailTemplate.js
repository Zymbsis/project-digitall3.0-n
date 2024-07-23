import path from 'node:path';
import handlebars from 'handlebars';
import fs from 'node:fs/promises';

export const getMailTemplate = async (template_filename) => {
  const filename = template_filename.includes('.html')
    ? template_filename
    : `${template_filename}.html`;

  const template_path = path.join(process.cwd(), 'src', 'templates', filename);
  const template_rawtext = (await fs.readFile(template_path)).toString();
  const template = handlebars.compile(template_rawtext);
  return template;
};
