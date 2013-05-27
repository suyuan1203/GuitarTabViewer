///<Song type="Song" id="27">
///  <title>Stairway to Heaven (Songsterr Plus Demo)</title>
///  <artist type="Artist" id="25">
///    <name>Led Zeppelin</name>
///  </artist>
///  <latestAvailableRevision type="Revision" id="39468">
///    <guitarProTab type="ERS3Attachment" id="3604881">
///      <attachmentUrl>http:///d25dtuqxdaiakz.cloudfront.net/3604881.gp4</attachmentUrl>
///    </guitarProTab>
///    <tracks type="Track">
///      <Track type="Track" id="653941">
///        <capoHeight>0</capoHeight>
///        <instrument>26</instrument>
///        <position>1</position>
///        <title>Guitare 2 (12 cordes)</title>
///        <tuning>64-59-55-50-45-40</tuning>
///        <withLyrics>false</withLyrics>
///        <trackAudios type="TrackAudio">
///          <TrackAudio type="TrackAudio" id="653940">
///            <speed>50</speed>
///            <mp3File type="ERS3Attachment" id="764461">
///              <attachmentUrl>http:///d4l1bc0fqn6e0.cloudfront.net/764461.dat</attachmentUrl>
///            </mp3File>
///          </TrackAudio>
///          <TrackAudio type="TrackAudio" id="653941">
///            <speed>100</speed>
///            <mp3File type="ERS3Attachment" id="764459">
///              <attachmentUrl>http:///d4l1bc0fqn6e0.cloudfront.net/764459.dat</attachmentUrl>
///            </mp3File>
///          </TrackAudio>
///        </trackAudios>
///        <trackLayoutImages type="TrackLayoutImage">
///        </trackLayoutImages>
///      </Track>
///    </tracks>
///    <mostPopularTrack type="Track" id="653950"/>
///  </latestAvailableRevision>
///</Song>

var Songsterr = function() {

	//private attributes
	var _callback = null;

	//private methods
	var _populateResult = function(xml) {
		$('#result').html("");
		var artist = null;

		//self-adapting height
		var count = $(xml).find('Song').length;
		var viewHeight = parseInt($(window).height()) - parseInt($('#serach').css("height"));
		if ((count * 45) > viewHeight) {
			$('#searchpanel').css('height', (viewHeight - 80) + 'px');
		} else {
			$('#searchpanel').css('height', 'auto');
		}

		/// <NSArray>
		///   <Song type="Song" id="115">
		///     <title>No Woman No Cry</title>
		///     <artist type="Artist" id="58">
		///       <nameWithoutThePrefix>Bob Marley</nameWithoutThePrefix>
		///       <useThePrefix>false</useThePrefix>
		///       <name>Bob Marley</name>
		///     </artist>
		///   </Song>
		///   <Song type="Song" id="259">
		///     <title>Redemption Song</title>
		///     <artist type="Artist" id="58"/>
		///   </Song>
		/// </NSArray>
		$(xml).find('Song').each(function() {
			var id = $(this).attr('id');
			var title = $(this).find('title').text();
			var _artist = $(this).find('artist').find('name').text();
			if (_artist) {
				artist = _artist;
			} else {
				_artist = new String(artist);
			}

			/// <ul>
			///     <li>
			///         <span class="songname">Hangar 18</span>
			///         <span class="artistname">Megadeth</span>
			///     </li>
			/// </ul>
			var ul = $('<ul></ul>');
			$('<li></li>').append($("<span class='songname'>" + title + "</span>").click(function() {
				$("#loading").show();
				Songsterr.loadSongInfo(id, _callback);
			})).append($("<span class='artistname'>" + _artist + "</span>").click(function() {
				$('#keyword').val(_artist);
				Songsterr.searchSongByArtist(_artist, _populateResult);
			})).appendTo(ul);
			ul.appendTo('#result');
		});
		$("#loading").hide();
	}
	return {
		//public attributes
		id : 27,
		gtpUrl : null,
		audios : new Array(),
		defaultTrack : 1,

		//public methods
		loadSongInfo : function(id, callback) {
			Songsterr.id = id;
			_callback = callback;
			$.ajax({
				type : "GET",
				//url: "http:///www.songsterr.com/a/ra/player/song/" + Songsterr.id + ".xml",
				url : "http:///0.0.0.0:1234/bysongid?key=" + Songsterr.id,
				dataType : "xml",
				success : function(xml) {
					Songsterr.gtpUrl = $(xml).find('guitarProTab').find('attachmentUrl').text().replace(/(\w*)\.cloudfront\.net\//,'0.0.0.0:1234/dat?domain='+'$1&'+'key=');
					var mostPopularTrack = $(xml).find('mostPopularTrack').attr('id');
					$(xml).find('Track').each(function() {
						var position = $(this).find('position').text();
						if ($(this).attr('id') == mostPopularTrack) {
							Songsterr.defaultTrack = position < 1 ? 1 : position;
						}
						$(this).find('TrackAudio').each(function() {
							if ($(this).find('speed').text() == "100") {
								Songsterr.audios[position] = $(this).find('attachmentUrl').text().replace(/(\w*)\.cloudfront\.net\//,'0.0.0.0:1234/dat?domain='+'$1&'+'key=');
								//alert(Songsterr.audios[position])
							}
						});
					});
					_callback();
				}
			});
		},
		searchSongByArtist : function(key) {
			$.ajax({
				type : "GET",
				//url: "http:///www.songsterr.com/a/ra/songs/byartists.xml?artists=\"" + key + "\"",
				url : "http:///0.0.0.0:1234/byartist?key=" + key,
				dataType : "xml",
				success : function(xml) {
					_populateResult(xml);
				}
			});
		},
		searchSong : function(key) {
			$.ajax({
				type : "GET",
				//url: "http:///www.songsterr.com/a/ra/songs.xml?pattern=" + key,
				url : "http:///0.0.0.0:1234/bysong?key=" + key,
				dataType : "xml",
				success : function(xml) {
					_populateResult(xml);
				}
			});
		}
	}
}();
