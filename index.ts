import './style.css';

import { fromEvent, skip } from 'rxjs';
import { switchMap, repeat, takeUntil, scan, map } from 'rxjs/operators';

let lineWidth = 2;
let canvas: HTMLCanvasElement = document.getElementById(
  'canvas'
) as HTMLCanvasElement;

let context = canvas.getContext('2d');
let cRect = canvas.getBoundingClientRect();
let offsetX = cRect.left;
let offsetY = cRect.top;

let $mouseDown = fromEvent(canvas, 'mousedown');
let $mouseUp = fromEvent(window, 'mouseup');
let $mouseMove = fromEvent(window, 'mousemove');
$mouseDown
  .pipe(
    switchMap((down) => $mouseMove),
    takeUntil($mouseUp),
    scan((acc, event) => ({ prev: acc.cuurentTarget, cuurentTarget: event }), {
      prev: null,
      cuurentTarget: null,
    }),
    skip(1),
    repeat()
  )
  .subscribe((data) => {
    let prevX = data.prev.clientX - offsetX;
    let prevY = data.prev.clientY - offsetY;
    let cuurentTargetX = data.cuurentTarget.clientX - offsetX;
    let cuurentTargetY = data.cuurentTarget.clientY - offsetY;

    context.beginPath();
    context.moveTo(prevX, prevY);
    context.lineTo(cuurentTargetX, cuurentTargetY);
    context.lineWidth = lineWidth;
    context.stroke();
    context.closePath();
  });

let clearButton = document.getElementById('clear');
let $clearClicked = fromEvent(clearButton, 'click');

$clearClicked.subscribe(() =>
  context.clearRect(0, 0, canvas.width, canvas.height)
);

let size = document.getElementById('size');
let $sizeChanged = fromEvent(size, 'change');

$sizeChanged
  .pipe(map((event) => (event.target as HTMLInputElement).value))
  .subscribe((value) => (lineWidth = +value || lineWidth));
