
var audioCtx1;
var audioCtx2;
var source1;
var source2;
var stream;
var analyser1;
var analyser2;
var splitter1;
var splitter2;
var processor1;
var processor2;
var bufferLength;
var bufferLength1;
var bufferLength2;
var dataArray1;
var dataArray2;

setVisualizer();

function setVisualizer() {
    navigator.mediaDevices.getUserMedia({
        audio: true,
        video: false
    })
        .then(stream => {
            audioCtx1 = new AudioContext();
            audioCtx2 = new AudioContext();
            audioCtx1.destination.channelCount = 2;
            audioCtx2.destination.channelCount = 2;
            processor1 = audioCtx1.createScriptProcessor(2048, 2, 2);
            processor2 = audioCtx2.createScriptProcessor(2048, 2, 2);
            source1 = audioCtx1.createMediaStreamSource(stream);
            source2 = audioCtx2.createMediaStreamSource(stream);
            splitter1 = audioCtx1.createChannelSplitter(2);
            splitter2 = audioCtx2.createChannelSplitter(2);
            analyser1 = audioCtx1.createAnalyser(2);
            analyser2 = audioCtx2.createAnalyser(2);
            source1.connect(splitter1);
            source2.connect(splitter2);
            source1.connect(processor1);
            source2.connect(processor2);
            source1.connect(analyser1);
            source2.connect(analyser2);
            bufferLength1 = analyser1.frequencyBinCount;
            bufferLength2 = analyser2.frequencyBinCount;
            dataArray1 = new Uint8Array(bufferLength1);
            dataArray2 = new Uint8Array(bufferLength2);
            bufferLength = bufferLength1 + bufferLength2;
            renderFrame();
        })
}

function renderFrame() {

    try {

        requestAnimationFrame(renderFrame);
        
        analyser1.getByteFrequencyData(dataArray1, 0);
        analyser2.getByteFrequencyData(dataArray2, 1);

        var dataArray = [];
        var inc;

        inc = 0;

        while (inc < dataArray1.length / 1.5) {
            dataArray.push(dataArray1[inc]);
            inc++;
        }

        inc = 0;
        while (inc < dataArray2.length / 1.5) {
            dataArray.push(dataArray2[inc]);
            inc++;
        }

        var parentcanvas = document.getElementById('parentcanvas');
        if (parentcanvas == null) {
            parentcanvas = document.createElement('div');
            document.getElementsByTagName('footer')[0].after(parentcanvas);
            parentcanvas.id = 'parentcanvas';
        }
        parentcanvas.style.position = 'relative';
        parentcanvas.style.display = 'inline-block';
        parentcanvas.style.width = 'calc(100%)';
        parentcanvas.style.height = '100px';
        parentcanvas.style.left = '0px';
        parentcanvas.style.top = '0px';
        parentcanvas.style.backgroundColor = '#000';
        var canvas = document.getElementsByTagName('canvas');
        if (canvas.length == 0) {
            canvas = document.createElement('canvas');
            parentcanvas.append(canvas);
            canvas.id = 'canvas';
        }
        canvas = document.getElementById('canvas');
        canvas.width = parentcanvas.clientWidth;
        canvas.height = parentcanvas.clientHeight;
        var WIDTH = canvas.width;
        var HEIGHT = canvas.height;
        var ctx = canvas.getContext('2d');
        var audiorawdata = dataArray;
        var barWidth = WIDTH / dataArray.length;
        var barHeight = HEIGHT;
        var x = 0;
        for (var i = 0; i < dataArray.length; i++) {
            barHeight = audiorawdata[i] / 2;
            ctx.fillStyle = '#ddd';
            ctx.strokeStyle = '#ddd';
            ctx.fillRect(x, HEIGHT / 2 - barHeight / 2, barWidth, barHeight / 2);
            ctx.fillRect(x, HEIGHT / 2 + barHeight / 2, barWidth, -barHeight / 2);
            x += barWidth;
        }
        ctx.stroke();
    }
    catch {
        setVisualizer();
    }
}