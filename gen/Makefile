HOST := $(shell rustc -Vv | grep '^host:' | cut -f 2 -d ' ')

.PHONY: all
all:
	pyinstaller --noconfirm --onefile --distpath ../tauri/binaries/ --name nyx-gen-$(HOST) ./nyx-gen

.PHONY: clean
clean:
	rm -rf ./*.spec ./build/ ../tauri/binaries/nyx-gen-$(HOST)
