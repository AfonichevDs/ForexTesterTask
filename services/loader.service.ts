export class LoaderService {
    public showLoader(): void {
        const loader = document.getElementById('loader');
        if (loader) {
            loader.style.display = 'block';
        }
    }
    
    public hideLoader(): void {
        const loader = document.getElementById('loader');
        if (loader) {
            loader.style.display = 'none';
        }
    }
}