(function(alphaTabWrapper) {
    alphaTabWrapper.fn.jPlayer = function(playerOptions) {
        var self = this;
        var defaults = {
            defaultTrack: 0,
            audioTracks: new Array(),
            song: null
        };

        var playerOptions = $.extend(defaults, playerOptions);

        // create mixer
        var audios = new Array();
        var tracks = $('#mixer_tracks');
        tracks.html("");
        this.options.track = playerOptions.defaultTrack;

        /// <div id='mixer_tracks'>
        ///     <div class='mixer_track'>
        ///         <div class='mixer_track_name'>
        ///             <span id='1' class='selected'>Dave 'Snake' Sabo - Overdriven Guitar</span>
        ///         </div>
        ///         <div class='mixer_checkbutton'>
        ///         <input type='checkbox' id='check_s_1' /><label for='check_s_1'></label>
        ///         </div>
        ///         <div class='mixer_checkbutton'>
        ///             <input type='checkbox' id='check_m_1' /><label for='check_m_1'></label>
        ///             </div>
        ///         <div id='volume_bar_1' class='mixer_track_volume_bar'>
        ///             <div id='volume_bar_value_1' class='mixer_track_volume_bar_value'>
        ///             </div>
        ///         </div>
        ///     </div>
        /// </div>
        for (var i = 0; i < playerOptions.song.tracks.length; i++) {
            $("<div class='mixer_track_name'></div>")
                .append($("<span/>", {
                    "id": i,
                    "class": this.options.track == i ? "selected" : null,
                    text: playerOptions.song.tracks[i].name + " - " + playerOptions.song.tracks[i].channel.getinstrumentname(),
                    click: function() {
                        if (self.options.track != $(this).attr("id")) {
                            $("span[id='" + self.options.track + "']").removeClass();
                            self.options.track = $(this).attr("id");
                            $(this).addClass("selected");
                            self.tablature.setTrack(playerOptions.song.tracks[parseInt(self.options.track)]);
                        }
                    }
                })).appendTo(tracks);

            $("<div class='mixer_checkbutton'><input type='checkbox' id='check_s_" + i + "' /><label for='check_s_" + i + "'></label></div>").appendTo(tracks);
            $("#check_s_" + i).button()
				.click(function() {
				    var id = $(this).attr('id').getLatestCharAsInt();
				    var action = $(this).attr('checked') ? "mute" : "unmute";
				    $(audios).each(function(index) {
				        if (id != index) {
				            audios[index].jPlayer(action);
				        }
				    });
				});

            $("<div class='mixer_checkbutton'><input type='checkbox' id='check_m_" + i + "' /><label for='check_m_" + i + "'></label></div>").appendTo(tracks);
            $("#check_m_" + i)
                .button()
                .click(function() {
                    var id = $(this).attr('id').getLatestCharAsInt();
                    if ($(this).attr('checked')) {
                        audios[id].jPlayer("mute");
                    }
                    else {
                        audios[id].jPlayer("unmute");
                    }
                });

            $("<div id='volume_bar_" + i + "' class='mixer_track_volume_bar'><div id='volume_bar_value_" + i + "' class='mixer_track_volume_bar_value'></div></div>").appendTo(tracks);
            $("#volume_bar_value_" + i).css("width", parseInt((playerOptions.song.tracks[i].channel.volume + 1) / 256 * 100) + 'px');
        };

        //destroy jPlayer if it is exist
        if ($.jPlayer || $.jPlayer.prototype.count > 0) {
            $.each($.jPlayer.prototype.instances, function(i, element) {
                if (element != null) {
                    element.jPlayer("clearMedia");
                    element.jPlayer("destroy");
                    element = null;
                }
            });
            $.jPlayer.prototype.count = 0;
        }

        //create jPlayer
        for (var i = 0; i < playerOptions.song.tracks.length; i++) {
            audios[i] = $("<div />").jPlayer({
                ready: function() {
                    var id = $(this).attr('id').getLatestCharAsInt()
                    $(this).jPlayer("setMedia", {
                        mp3: playerOptions.audioTracks[id]
                    });
                },
                supplied: "mp3",
                preload: "auto",
                cssSelectorAncestor: "",
                volume: (playerOptions.song.tracks[i].channel.volume + 1) / 256,
                cssSelector: {
                    play: "#play_button",
                    pause: "#pause_button",
                    stop: "#stop_button",
                    volumeBar: "#volume_bar_" + i,
                    volumeBarValue: "#volume_bar_value_" + i
                }
            });
        }

        //bind the control event
        audios[0].bind($.jPlayer.event.pause, function(event) {
            for (var i = 0; i < audios.length; i++) {
                audios[i].jPlayer("pause", event.jPlayer.status.currentTime);
            }
        });

        audios[0].bind($.jPlayer.event.play, function(event) {
            for (var i = 0; i < audios.length; i++) {
                if (event.jPlayer.status.currentTime == 0) {
                    audios[i].jPlayer("play");
                }
                else {
                    audios[i].jPlayer("play", event.jPlayer.status.currentTime);
                }
            }
        });

        audios[0].bind($.jPlayer.event.timeupdate, function(event) {
            var defaulLenght = 960;
            var position = defaulLenght;
            var defaultStart = defaulLenght;
            if (event.jPlayer.status.currentTime > 0) {
                if (!this._tickDuration) {
                    var lastHeader = playerOptions.song.measureHeaders[playerOptions.song.measureHeaders.length - 1];
                    var denominator = lastHeader.timeSignature.denominator.value;
                    if (denominator == 8) {
                        if (lastHeader.timeSignature.numerator % 3 == 0) {
                            defaulLenght += Math.floor(960 / 2);
                        }
                    }
                    this._tickDuration = lastHeader.start + lastHeader.timeSignature.numerator * defaulLenght - defaultStart;
                }
                if (!this._detla) {
                    this._detla = 60 / playerOptions.song.tempo * playerOptions.song.measureHeaders.length * 4 / event.jPlayer.status.duration;
                }
                position = event.jPlayer.status.currentPercentRelative / 100 * this._tickDuration + defaultStart;
                position = position * this._detla;

                //position = event.jPlayer.status.currentPercentRelative / 100 * tickDuration;

                //position = event.jPlayer.status.currentTime * playerOptions.song.tempo * 960 / 60 + 1920;

                //position = position * 90 / playerOptions.song.tempo;

                //60000 / (BPM * PPQ)

                //time_in_milliseconds = time_in_ticks * tempo / time_division
                //time_in_ticks = time_in_milliseconds * 1000 * time_division / tempo;
                //                try {
                //                    var time_division = self.tablature.songManager.getDivisionLength(playerOptions.song.measureHeaders[0]) * playerOptions.song.measureHeaders[0].timeSignature.numerator; //defaulLenght = 960;
                //                    alert(time_division);
                //                }
                //                catch (err) {
                //                    alert(err);
                //                }
                //position = (event.jPlayer.status.currentPercentRelative / 100 * playerOptions.song.measureHeaders.length + 0.5) * 3840;
                //position = position * 60 / playerOptions.song.tempo;

            }
            self.updateCaret(position);
        });

        // create carets
        var measureCaret = $('<div class="measureCaret"></div>');
        var beatCaret = $('<div class="beatCaret"></div>');
        // set styles
        measureCaret.css({ 'opacity': 0.25, 'position': 'relative', background: '#FFF200' });
        beatCaret.css({ 'opacity': 0.75, 'position': 'relative', background: '#4040FF' });
        measureCaret.width(0);
        beatCaret.width(0);
        measureCaret.height(0);
        beatCaret.height(0);
        this.el.append(measureCaret);
        this.el.append(beatCaret);

        this.updateCaret = function(tickPos) {
            setTimeout(function() {
                self.tablature.notifyTickPosition(tickPos);
            }, 1);
        }

        this.tablature.onCaretChanged = function(beat) {
            var x = $(self.canvas).offset().left + parseInt($(self.canvas).css("borderLeftWidth"), 10);
            var y = $(self.canvas).offset().top;
            y += beat.measureImpl().posY;

            measureCaret.width(beat.measureImpl().width + beat.measureImpl().spacing);
            measureCaret.height(beat.measureImpl().height());
            measureCaret.offset({ top: y, left: x + beat.measureImpl().posX });

            beatCaret.offset({ top: y, left: x + beat.getRealPosX(self.tablature.viewLayout) });
            beatCaret.width(3);
            beatCaret.height(measureCaret.height());

            if (beat.measureImpl().isFirstOfLine) {
                $("#mainpanel").animate({ scrollTop: beat.measureImpl().posY - measureCaret.height() }, 0);
            }
        }

        return this;
    }

})(alphaTabWrapper);

String.prototype.getLatestCharAsInt = function() {
    return parseInt(this.toString().charAt(this.toString().length - 1));
}

