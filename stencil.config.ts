import fs from 'fs';
import path from 'path';
import { Config } from '@stencil/core';
import { sass } from '@stencil/sass';
import { postcss } from '@stencil/postcss';
import postCSSPresetEnv from 'postcss-preset-env';
import cssnano from 'cssnano';
import { createFilter } from 'rollup-pluginutils';
import replace from '@rollup/plugin-replace';

const pkgManifest = JSON.parse(fs.readFileSync('package.json', 'utf8'));

function resolveGqlIncludes(code, id) {
  // Parse @include path
  const regex = /# *?@include *"(?<path>.*)"\n/g;

  let resolvedCode = code;
  let result;

  // Loop over @include statements until there's none left
  // eslint-disable-next-line no-cond-assign
  while ((result = regex.exec(resolvedCode)) !== null) {
    // Resolve absole path from the file path and @include paths
    const dir = path.dirname(id);
    const absPath = path.normalize(path.join(dir, result.groups.path));

    // Replace the @include statement with the file contents
    const includedFile = fs.readFileSync(absPath, 'utf8');
    resolvedCode = resolvedCode.replace(result[0], includedFile);
  }
  return resolvedCode;
}

interface Options {
  include?: string;
  exclude?: string;
}

function gql(opts: Options = {}) {
  if (!opts.include) {
    opts.include = 'src/**/*.graphql'; // eslint-disable-line no-param-reassign
  }

  const filter = createFilter(opts.include, opts.exclude);

  return {
    name: 'gql',
    // eslint-disable-next-line consistent-return
    transform(code, id) {
      if (filter(id)) {
        const resolvedCode = resolveGqlIncludes(code, id);

        return {
          code: `export default ${JSON.stringify(resolvedCode)}`,
        };
      }
    },
  };
}

function svg(opts: Options = {}) {
  const filter = createFilter(opts.include || '**/*.svg', opts.exclude);

  return {
    name: 'svg',
    // eslint-disable-next-line consistent-return
    transform(code, id) {
      if (filter(id)) {
        // Rollup by default returns a base64 URL. Decode that back into HTML for SVGs
        const transformed = code.replace(/'[^']+'/, data =>
          JSON.stringify(
            Buffer.from(data.replace('data:image/svg+xml;base64,', ''), 'base64').toString('utf8')
          )
        );
        return { code: transformed };
      }
    },
  };
}

export const config: Config = {
  namespace: 'manifold-subscription',
  globalStyle: 'src/styles/index.scss',
  outputTargets: [
    {
      type: 'dist',
      esmLoaderPath: '../loader',
    },
    {
      type: 'www',
      serviceWorker: null, // disable service workers
    },
  ],
  plugins: [
    gql(),
    svg(),
    sass(),
    postcss({
      plugins: [cssnano(), postCSSPresetEnv()],
    }),
    replace({
      exclude: 'node_modules/**',
      delimiters: ['<@', '@>'],
      values: {
        NPM_PACKAGE_VERSION: pkgManifest.version,
      },
    }),
  ],
};
