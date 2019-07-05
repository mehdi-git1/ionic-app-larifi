import { Component, ElementRef, ViewChild, Input } from '@angular/core';
import { NavController } from 'ionic-angular';
import * as PDFJS from 'pdfjs-dist/webpack.js';
import { PDFPageProxy, PDFPageViewport, PDFRenderTask } from 'pdfjs-dist';

@Component({
    selector: 'pdf-viewer',
    templateUrl: 'pdf-viewer.component.html'
})
export class PdfViewerComponent {
    pdfDocument: PDFJS.PDFDocumentProxy;
    PDFJSViewer = PDFJS;
    pageContainerUnique = {
        width: 0 as number,
        height: 0 as number,
        element: null as HTMLElement,
        canvas: null as HTMLCanvasElement,
        textContainer: null as HTMLElement,
        canvasWrapper: null as HTMLElement
    }
    @ViewChild('pageContainer') pageContainerRef: ElementRef;
    @ViewChild('viewer') viewerRef: ElementRef;
    @ViewChild('canvas') canvasRef: ElementRef;
    @ViewChild('canvasWrapper') canvasWrapperRef: ElementRef;
    @ViewChild('textContainer') textContainerRef: ElementRef;

    constructor(public navCtrl: NavController) {
        console.log(this.PDFJSViewer);
    }
    @Input()
    set base64(base64: string) {
        const raw = window.atob(base64);
        const rawLength = raw.length;
        var array = new Uint8Array(new ArrayBuffer(rawLength));
        for (let i = 0; i < rawLength; i++) {
            array[i] = raw.charCodeAt(i);
        }
        const pdfAsArray = array;
        this.PDFJSViewer.getDocument(pdfAsArray)
        .then(pdf => {
            this.pdfDocument = pdf;
            console.log("pdf loaded:"); console.dir(this.pdfDocument);
            return this.loadPage(1);
        }).then((pdfPage) => {
            console.dir(pdfPage);
        }).catch(e => {
            console.error(e);
            return false;
        });
    }
    ionViewDidLoad() {
        this.pageContainerUnique.element = this.pageContainerRef.nativeElement as HTMLElement;
        this.pageContainerUnique.canvasWrapper = this.canvasWrapperRef.nativeElement as HTMLCanvasElement;
        this.pageContainerUnique.canvas = this.canvasRef.nativeElement as HTMLCanvasElement;
        this.pageContainerUnique.textContainer = this.textContainerRef.nativeElement as HTMLCanvasElement;
        //this.loadPdf('assets/pdf1.pdf');
    }
    
    loadPdf(pdfPath: string): Promise<boolean> {

        return this.PDFJSViewer.getDocument(pdfPath)
            .then(pdf => {
                this.pdfDocument = pdf;
                console.log("pdf loaded:"); console.dir(this.pdfDocument);
                return this.loadPage(1);
            }).then((pdfPage) => {
                console.dir(pdfPage);
            }).catch(e => {
                console.error(e);
                return false;
            });
    }

    loadPage(pageNum: number = 1) {
        let pdfPage: PDFPageProxy;

        return this.pdfDocument.getPage(pageNum).then(thisPage => {
            pdfPage = thisPage;
            return this.renderOnePage(pdfPage);
        }).then(() => {
            return pdfPage;
        });

    } // loadpage()



    async renderOnePage(pdfPage: PDFPageProxy) {

        let textContainer: HTMLElement;
        let canvas: HTMLCanvasElement;
        let wrapper: HTMLElement;

        let canvasContext: CanvasRenderingContext2D;
        let page: HTMLElement

        page = this.pageContainerUnique.element;
        textContainer = this.pageContainerUnique.textContainer;
        canvas = this.pageContainerUnique.canvas;
        wrapper = this.pageContainerUnique.canvasWrapper;

        canvasContext = canvas.getContext('2d') as CanvasRenderingContext2D;
        canvasContext.imageSmoothingEnabled = false;
        /*canvasContext.webkitImageSmoothingEnabled = false;
        canvasContext.mozImageSmoothingEnabled = false;
        canvasContext.oImageSmoothingEnabled = false;*/

        let viewport = pdfPage.getViewport(1) as PDFPageViewport;

        canvas.width = viewport.width;
        canvas.height = viewport.height;
        page.style.width = `${viewport.width}px`;
        page.style.height = `${viewport.height}px`;
        wrapper.style.width = `${viewport.width}px`;
        wrapper.style.height = `${viewport.height}px`;
        textContainer.style.width = `${viewport.width}px`;
        textContainer.style.height = `${viewport.height}px`;

        //fix for 4K


        if (window.devicePixelRatio > 1) {
            let canvasWidth = canvas.width;
            let canvasHeight = canvas.height;

            canvas.width = canvasWidth * window.devicePixelRatio;
            canvas.height = canvasHeight * window.devicePixelRatio;
            canvas.style.width = canvasWidth + "px";
            canvas.style.height = canvasHeight + "px";

            canvasContext.scale(window.devicePixelRatio, window.devicePixelRatio);
        }

        // THIS RENDERS THE PAGE !!!!!!


        let renderTask: PDFRenderTask = pdfPage.render({
            canvasContext,
            viewport
        });

        let container = textContainer;

        return renderTask.then(() => {
            //console.error("I WORK JUST UNTIL HERE");


            return pdfPage.getTextContent();

        }).then((textContent) => {

            let textLayer: HTMLElement;


            textLayer = this.pageContainerUnique.textContainer


            while (textLayer.lastChild) {
                textLayer.removeChild(textLayer.lastChild);
            }

            this.PDFJSViewer.renderTextLayer({
                textContent,
                container,
                viewport,
                textDivs: []
            });

            return true;
        });
    }
}