# Development purposes

serve: restart
	fswatch -or --event=Updated ./src | xargs -n1 -I {} make restart

restart: 
	npm run build
	
.PHONY: serve start