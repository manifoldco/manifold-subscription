package:
	@echo 🧹 Creating clean workspace…
	rm -rf pkg
	mkdir pkg

	@echo 📦 Building package…
	npm run build
	cp -r dist pkg/.
	cp -r loader pkg/.
	cp CHANGELOG.md pkg/.
	cp LICENSE pkg/.
	cp package.json pkg/.
	cp README.md pkg/.
	npm run clean-package-json
