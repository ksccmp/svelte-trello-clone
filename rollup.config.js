import path from 'path';
import svelte from 'rollup-plugin-svelte';
import commonjs from '@rollup/plugin-commonjs';
import resolve from '@rollup/plugin-node-resolve';
import livereload from 'rollup-plugin-livereload';
import { terser } from 'rollup-plugin-terser';
import css from 'rollup-plugin-css-only';
import sveltePreprocess from 'svelte-preprocess';
import alias from '@rollup/plugin-alias';
import strip from '@rollup/plugin-strip';

const production = !process.env.ROLLUP_WATCH;

function serve() {
	let server;

	function toExit() {
		if (server) server.kill(0);
	}

	return {
		writeBundle() {
			if (server) return;
			server = require('child_process').spawn('npm', ['run', 'start', '--', '--dev'], {
				stdio: ['ignore', 'inherit', 'inherit'],
				shell: true
			});

			process.on('SIGTERM', toExit);
			process.on('exit', toExit);
		}
	};
}

export default {
	input: 'src/main.js',
	output: {
		sourcemap: true,
		format: 'iife',
		name: 'app',
		file: 'public/build/bundle.js'
	},
	plugins: [
		svelte({
			compilerOptions: {
				// enable run-time checks when not in production
				dev: !production,
			},
			
			// 전처리
			preprocess: sveltePreprocess({
				// scss로 style된 모든 곳에 main.scss를 적용시키기
				scss: {
					prependData: '@import "./src/scss/main.scss";'
				},
				// 후처리
				postcss: {
					plugins: [
						require('autoprefixer')()
					]
				}
			})
		}),
		// we'll extract any component CSS out into
		// a separate file - better for performance
		css({ output: 'bundle.css' }),

		// If you have external dependencies installed from
		// npm, you'll most likely need these plugins. In
		// some cases you'll need additional configuration -
		// consult the documentation for details:
		// https://github.com/rollup/plugins/tree/master/packages/commonjs
		resolve({
			browser: true,
			dedupe: ['svelte']
		}),

		commonjs(),

		// 경로 별칭
		alias({
			entries: [
				{
					find: '~',
					replacement: path.resolve(__dirname, 'src/'),
				}
			]
		}),

		// In dev mode, call `npm run start` once
		// the bundle has been generated
		!production && serve(),

		// Watch the `public` directory and refresh the
		// browser on changes when not in production
		!production && livereload('public'),

		// If we're building for production (npm run build
		// instead of npm run dev), minify
		production && terser(),

		// 제품단계에서 로그 제거
		production && strip({
			include: '**/*.(svelte|js)',
			// functions: ['console.*', 'assert.*'] // 기본값으로 명시되어 있음
		}),
	],
	watch: {
		clearScreen: false
	}
};
