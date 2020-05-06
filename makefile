install:
	plasmapkg2 --type kwinscript -i .
	mkdir -p ~/.local/share/kservices5
	ln -sf ~/.local/share/kwin/scripts/desktop-pin/metadata.desktop ~/.local/share/kservices5/kwin-script-desktop-pin.desktop

uninstall:
	plasmapkg2 --type kwinscript -r desktop-pin
	rm ~/.local/share/kservices5/kwin-script-desktop-pin.desktop

debug:
	QT_LOGGING_RULES="kwin_*.debug=true" kwin --replace && tail -f ~/.xsession-errors