$(function () { // When the DOM is ready
    let hasAudioInit = false;
    let timerMode = 0; // 0 = Infinite, 15/30/45/60 = Minutes
    let audio, audioContext, audioAnalyzer, data, audioSourceNode, frameRequestID, timerID;
    $('#playButton').click(function () {
        if (!hasAudioInit) { // first time
            audio = new Audio();
            audio.loop = true;
            audio.autoplay = false;
            audio.src = './assets/audio/hush.mp3';
            audio.controls = true;
            audio.poster = '';
            audio.title = 'HushLittleBaby';
            audio.play().then(r => function () {
                audio.pause();
            });
            audio.currentTime = 0
            setTimeout(function() {
                audio.play()
            }, 1);
            audioContext = new (window.AudioContext || window.webkitAudioContext)();
            audioAnalyzer = audioContext.createAnalyser();
            data = new Uint8Array(audioAnalyzer.frequencyBinCount);
            audio.addEventListener('canplay', function() {
                if (!audioSourceNode) {
                    audioSourceNode = audioContext.createMediaElementSource(audio);
                }
                audioSourceNode.connect(audioAnalyzer);
                audioAnalyzer.connect(audioContext.destination);
            });
            hasAudioInit = true;
        } else {
            if (audio.paused) {
                audio.play() // Need to break these out into actual events/functions becuse we have timers and iphoine lock screens that can control this too
            } else {
                audio.pause();
                cancelAnimationFrame(frameRequestID);
                $('#blob').css('border-radius', '50%');
            }
        }
        function analyzeAudio() {
            audioAnalyzer.getByteFrequencyData(data);
            const analyzedVolumeAsPercent = (avg(data.slice((data.length/2) - 1, data.length - 1)) * 2) / 100; // Stealing some of the math from here: https://medium.com/@mag_ops/music-visualiser-with-three-js-web-audio-api-b30175e7b5ba
            const radiusVariance = 15;
            const blobRadius = 50;
            const currentVolumeAsRadius = blobRadius - (radiusVariance * analyzedVolumeAsPercent);
            let radiusArray = [
                currentVolumeAsRadius * (randomInteger(70, 90) / 100),
                currentVolumeAsRadius * (randomInteger(100, 130) / 100),
                currentVolumeAsRadius * (randomInteger(70, 90) / 100),
                currentVolumeAsRadius * (randomInteger(90, 100) / 100),
                currentVolumeAsRadius * (randomInteger(90, 110) / 100),
                currentVolumeAsRadius * (randomInteger(100, 130) / 100),
                currentVolumeAsRadius * (randomInteger(90, 110) / 100),
                currentVolumeAsRadius * (randomInteger(80, 100) / 100)
            ]
            if (currentVolumeAsRadius == 50) {
                radiusArray = [blobRadius, blobRadius, blobRadius, blobRadius, blobRadius, blobRadius, blobRadius, blobRadius];
            }
            $('#blob').css('border-radius', `${radiusArray[0]}% ${radiusArray[1]}% ${radiusArray[2]}% ${radiusArray[3]}% / ${radiusArray[4]}% ${radiusArray[5]}% ${radiusArray[6]}% ${radiusArray[7]}%`);
            frameRequestID = requestAnimationFrame(analyzeAudio);
        }
        frameRequestID = requestAnimationFrame(analyzeAudio);
    });

    function stopAudio() {
        audio.pause();
    }
    // $('#timerButton').click(function() {
    //     switch (timerMode) {
    //         case 0:
    //             $(this).html('15<sup>M</sup>');
    //             timerMode = 15;
    //             clearTimeout(timerID);
    //             timerID = setTimeout(stopAudio, timerMode * 1000 * 60);
    //             break;
    //         case 15:
    //             $(this).html('30<sup>M</sup>');
    //             timerMode = 30;
    //             clearTimeout(timerID);
    //             timerID = setTimeout(stopAudio, timerMode * 1000 * 60);
    //             break;
    //         case 30:
    //             $(this).html('45<sup>M</sup>');
    //             timerMode = 45;
    //             clearTimeout(timerID);
    //             timerID = setTimeout(stopAudio, timerMode * 1000 * 60);
    //             break;
    //         case 45:
    //             $(this).html('60<sup>M</sup>');
    //             timerMode = 60;
    //             clearTimeout(timerID);
    //             timerID = setTimeout(stopAudio, timerMode * 1000 * 60);
    //             break;
    //         case 60:
    //             $(this).html('&#x221e;');
    //             timerMode = 0;
    //             clearTimeout(timerID);
    //             break;
    //         default:
    //             $(this).html('&#x221e;');
    //             timerMode = 0;
    //             clearTimeout(timerID);
    //             break;
    //     }
    // });
    // $('#speedButton').click(function() {
    //     switch (audio.playbackRate) {
    //         case 0.5:
    //             audio.playbackRate = 1;
    //             $(this).html('1<sup>x</sup>');
    //             break;
    //         case 1:
    //             audio.playbackRate = 1.25;
    //             $(this).html('1.25<sup>x</sup>');
    //             break;
    //         case 1.25:
    //             audio.playbackRate = 1.5;
    //             $(this).html('1.5<sup>x</sup>');
    //             break;
    //         case 1.5:
    //             audio.playbackRate = 2;
    //             $(this).html('2<sup>x</sup>');
    //             break;
    //         case 2:
    //             audio.playbackRate = 0.5;
    //             $(this).html('0.5<sup>x</sup>');
    //             break;
    //         default:
    //             audio.playbackRate = 1;
    //             $(this).html('1<sup>x</sup>');
    //             break;
    //     }
    // });
    // $('#volumeButton').click(function() {
    //     switch (audio.volume) {
    //         case 0.2:
    //             audio.volume = 0.4;
    //             $(this).html('40<sup>%</sup>');
    //             break;
    //         case 0.4:
    //             audio.volume = 0.6;
    //             $(this).html('60<sup>%</sup>');
    //             break;
    //         case 0.6:
    //             audio.volume = 0.8;
    //             $(this).html('80<sup>%</sup>');
    //             break;
    //         case 0.8:
    //             audio.volume = 1;
    //             $(this).html('100<sup>%</sup>');
    //             break;
    //         case 1:
    //             audio.volume = 0.2;
    //             $(this).html('20<sup>%</sup>');
    //             break;
    //         default:
    //             audio.volume = 1;
    //             $(this).html('100<sup>%</sup>');
    //             break;
    //     }
    // });

    function avg(arr){
        const total = arr.reduce(function(sum, b) { return sum + b; });
        return (total / arr.length);
    }

    function randomInteger(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    const transitionEnd = 'transitionend webkitTransitionEnd oTransitionEnd MSTransitionEnd';

    $('#playButton').click(function( e ) {
        e.preventDefault();
        if ( $(this).hasClass('stop') ) {
            $(this).removeClass('stop').addClass( 'to-play' );
        } else if ( !$(this).hasClass('to-play') ) {
            $( this ).addClass( 'stop' );
        }
    });

    $(document).on(transitionEnd, '.to-play', function() {
        $(this).removeClass( 'to-play' );
    });
});
