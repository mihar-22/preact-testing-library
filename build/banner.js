const path = require('path');

const pkg = path.resolve(process.cwd(), 'package.json');
const data = require.resolve(pkg);

export default `/*!
 * preact-testing-library
 * (c) 2019-${new Date().getFullYear()} ${data.author}
 * Released under the MIT License.
 */
`;
