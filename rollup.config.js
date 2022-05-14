import path from "path"
import typescript from '@rollup/plugin-typescript';
import commonjs from 'rollup-plugin-commonjs'
import resolve from 'rollup-plugin-node-resolve'
import progress from 'rollup-plugin-progress'
import { terser } from 'rollup-plugin-terser'
import tsConfig from "./tsconfig.json"

const EXTENSIONS = ['.ts']
const DIST = path.resolve(__dirname, 'dist')

export default [
	{
		input: 'src/event-emitter.ts',
		output: [
			{
				file: path.resolve(DIST, 'event-emitter.js'),
				format: 'es',
				sourcemap: true,
				indent: false,
			},
		],
		plugins: [
			resolve({ extensions: EXTENSIONS }),
      typescript({
        tsconfig: path.resolve(__dirname, 'tsconfig.json'),
        exclude: [...tsConfig.exclude, './**/*.test.ts'],
        target: 'es6'
      }),
			commonjs({ include: 'node_modules/**' }),
			terser(),
			progress(),
		],
	},
]
