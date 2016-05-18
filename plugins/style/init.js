addCommand("style", function(text) {
	var output=""; var iMode=0; var bMode=0; var sMode=0; var dMode=0; var fMode=0;
	for (var i=1; i<text.length; i++) {
		if(text[i]=="`"){iMode=!iMode;}else if(text[i]=="*"){bMode=!bMode;}else if(text[i]=="~"){sMode=!sMode;}else if(text[i]=="="){dMode=!dMode;}else if(text[i]=="_"){fMode=!fMode;}else{
		var no = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz".indexOf(text.charAt(i));
			if (fMode&&text.charCodeAt(i)>=32&&text.charCodeAt(i)<=126) {
				output += "　！＂＃＄％＆＇（）＊＋，－．／０１２３４５６７８９：；＜＝＞？＠ＡＢＣＤＥＦＧＨＩＪＫＬＭＮＯＰＱＲＳＴＵＶＷＸＹＺ［＼］＾＿｀ａｂｃｄｅｆｇｈｉｊｋｌｍｎｏｐｑｒｓｔｕｖｗｘｙｚ｛｜｝～".substr(text.charCodeAt(i)-32,1);
			} else if (iMode&&bMode&&no!=-1) {output += "𝟎𝟏𝟐𝟑𝟒𝟓𝟔𝟕𝟖𝟗𝘼𝘽𝘾𝘿𝙀𝙁𝙂𝙃𝙄𝙅𝙆𝙇𝙈𝙉𝙊𝙋𝙌𝙍𝙎𝙏𝙐𝙑𝙒𝙓𝙔𝙕𝙖𝙗𝙘𝙙𝙚𝙛𝙜𝙝𝙞𝙟𝙠𝙡𝙢𝙣𝙤𝙥𝙦𝙧𝙨𝙩𝙪𝙫𝙬𝙭𝙮𝙯".substr(no*2,2);
			} else if (iMode&&no!=-1) {output += "𝟶𝟷𝟸𝟹𝟺𝟻𝟼𝟽𝟾𝟿𝘈𝘉𝘊𝘋𝘌𝘍𝘎𝘏𝘐𝘑𝘒𝘓𝘔𝘕𝘖𝘗𝘘𝘙𝘚𝘛𝘜𝘝𝘞𝘟𝘠𝘡𝘢𝘣𝘤𝘥𝘦𝘧𝘨𝘩𝘪𝘫𝘬𝘭𝘮𝘯𝘰𝘱𝘲𝘳𝘴𝘵𝘶𝘷𝘸𝘹𝘺𝘻".substr(no*2,2);
			} else  if (bMode&&no!=-1) {output += "𝟬𝟭𝟮𝟯𝟰𝟱𝟲𝟳𝟴𝟵𝗔𝗕𝗖𝗗𝗘𝗙𝗚𝗛𝗜𝗝𝗞𝗟𝗠𝗡𝗢𝗣𝗤𝗥𝗦𝗧𝗨𝗩𝗪𝗫𝗬𝗭𝗮𝗯𝗰𝗱𝗲𝗳𝗴𝗵𝗶𝗷𝗸𝗹𝗺𝗻𝗼𝗽𝗾𝗿𝘀𝘁𝘂𝘃𝘄𝘅𝘆𝘇".substr(no*2,2);
			} else  if (sMode&&no!=-1) {output += "𝟎𝟏𝟐𝟑𝟒𝟓𝟔𝟕𝟖𝟗𝓐𝓑𝓒𝓓𝓔𝓕𝓖𝓗𝓘𝓙𝓚𝓛𝓜𝓝𝓞𝓟𝓠𝓡𝓢𝓣𝓤𝓥𝓦𝓧𝓨𝓩𝓪𝓫𝓬𝓭𝓮𝓯𝓰𝓱𝓲𝓳𝓴𝓵𝓶𝓷𝓸𝓹𝓺𝓻𝓼𝓽𝓾𝓿𝔀𝔁𝔂𝔃".substr(no*2,2);
			} else  if (dMode&&no!=-1) {output += "𝟘𝟙𝟚𝟛𝟜𝟝𝟞𝟟𝟠𝟡𝔸𝔹ℂ\0𝔻𝔼𝔽𝔾ℍ\0𝕀𝕁𝕂𝕃𝕄ℕ\0𝕆ℙ\0ℚ\0ℝ\0𝕊𝕋𝕌𝕍𝕎𝕏𝕐ℤ\0𝕒𝕓𝕔𝕕𝕖𝕗𝕘𝕙𝕚𝕛𝕜𝕝𝕞𝕟𝕠𝕡𝕢𝕣𝕤𝕥𝕦𝕧𝕨𝕩𝕪𝕫".substr(no*2,2);
			} else {output += text.charAt(i);}
		}
	}
	sendMessage(output);
},"/style normal `𝘪𝘵𝘢𝘭𝘪𝘤` *𝗯𝗼𝗹𝗱* ~𝓬𝓾𝓻𝓼𝓲𝓿𝓮~ =𝕕𝕠𝕦𝕓𝕝𝕖= _ｆｕｌｌｗｉｄｔｈ_ => posts styled text");
