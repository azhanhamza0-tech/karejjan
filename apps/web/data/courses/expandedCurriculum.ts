import type { Lesson, TrackId } from '../../types/domain';
import { HTML_LESSONS } from './htmlCourse';
import { CSS_LESSONS } from './cssCourse';
import { JS_LESSONS } from './jsCourse';
import { REACT_LESSONS } from './reactCourse';
import { VITE_LESSONS } from './viteCourse';
import { TSX_LESSONS } from './tsxCourse';
import { PYTHON_LESSONS } from './pythonCourse';
import { CPP_LESSONS } from './cppCourse';

// Topic blueprints for expanding HTML from lesson 23 to 105
const HTML_TOPIC_BLUEPRINTS: { titleKurdish: string; titleEnglish: string; tag: string; desc: string; syntax: string; code: string; ch: string; diff: 'beginner' | 'intermediate' | 'advanced' }[] = [
  // Ch 2: Elements, Links & Tables (23-35)
  { titleKurdish: 'بەستەری پەیوەندی بە ئیمەیڵ (mailto)', titleEnglish: 'HTML Email Links with mailto', tag: '<a href="mailto:...">', desc: 'چۆنیەتی دانانی لینکی ڕاستەوخۆ بۆ کردنەوەی ئەپی ئیمەیڵ کاتێک بەکارهێنەر کلیک دەکات.', syntax: '<a href="mailto:info@karejan.org">ئیمەیڵمان بۆ بنێرە</a>', code: '<p>پەیوەندیمان پێوە بکە: <a href="mailto:support@karejan.org?subject=پرسیار">support@karejan.org</a></p>', ch: 'ch-html-2', diff: 'beginner' },
  { titleKurdish: 'بەستەری پەیوەندی بە تەلەفۆن (tel)', titleEnglish: 'HTML Phone Links with tel', tag: '<a href="tel:...">', desc: 'دروستکردنی بەستەر بۆ پەیوەندی تەلەفۆنی ڕاستەوخۆ لە مۆبایل و تابلێت.', syntax: '<a href="tel:+9647500000000">پەیوەندی بکە</a>', code: '<p>ژمارەی مۆبایل: <a href="tel:+9647501234567">0750 123 4567</a></p>', ch: 'ch-html-2', diff: 'beginner' },
  { titleKurdish: 'دابەزاندنی فایل بە سیفەتی download', titleEnglish: 'HTML Download Attribute', tag: '<a href="..." download>', desc: 'چۆن فایلێک ڕاستەوخۆ دابەزێنیت لەبری کردنەوەی لە وێبگەڕ.', syntax: '<a href="guide.pdf" download="karejan-guide.pdf">داگرتنی کتێب</a>', code: '<a href="sample.pdf" download="Karejan-Course.pdf" class="btn">📥 داگرتنی فایلی وانەکان</a>', ch: 'ch-html-2', diff: 'beginner' },
  { titleKurdish: 'بەستەری پەڕینەوە لەناو هەمان لاپەڕە (Bookmark)', titleEnglish: 'HTML Bookmarks & Jump Links', tag: '<a href="#section-id">', desc: 'بەستنەوەی دوگمەکان بە بەشێکی تایبەت لە هەمان پەڕەدا بە ID.', syntax: '<a href="#faq">بڕۆ بۆ پرسیارە باوەکان</a>\n...\n<section id="faq">...</section>', code: '<nav><a href="#about">دەربارە</a> | <a href="#contact">پەیوەندی</a></nav>\n<div style="height:300px"></div>\n<h2 id="about">بەشی دەربارە</h2>', ch: 'ch-html-2', diff: 'beginner' },
  { titleKurdish: 'وێنەی کاردانەوەدار بە تاگی <picture>', titleEnglish: 'Responsive Images with <picture>', tag: '<picture>', desc: 'پیشاندانی وێنەی جیاواز بەپێی قەبارەی شاشەی مۆبایل و کۆمپیوتەر بۆ خێرایی باڵا.', syntax: '<picture>\n  <source media="(min-width: 800px)" srcset="large.jpg">\n  <img src="small.jpg" alt="وێنە">\n</picture>', code: '<picture>\n  <source media="(min-width: 600px)" srcset="https://picsum.photos/600/200">\n  <img src="https://picsum.photos/300/150" alt="وێنەی گونجاو">\n</picture>', ch: 'ch-html-2', diff: 'intermediate' },
  { titleKurdish: 'بارکردنی لەسەرخۆی وێنەکان (Lazy Loading)', titleEnglish: 'HTML Native Lazy Loading', tag: '<img loading="lazy">', desc: 'خێراکردنی ماڵپەڕ بە بارنەکردنی وێنەکان تا ئەو کاتەی بەکارهێنەر دەگاتە لایان.', syntax: '<img src="photo.jpg" loading="lazy" alt="...">', code: '<img src="https://picsum.photos/400/200" loading="lazy" alt="وێنەی خێرا" width="400" height="200">', ch: 'ch-html-2', diff: 'intermediate' },
  { titleKurdish: 'تاگی وێنەگەری و ژێرنووس <figure> و <figcaption>', titleEnglish: 'HTML Figure & Figcaption', tag: '<figure>', desc: 'دانانی وێنە یان دیاگرام لەگەڵ ڕوونکردنەوەی فەرمی لەژێریدا بە شێوازی ستاندارد.', syntax: '<figure>\n  <img src="chart.png" alt="خشتە">\n  <figcaption>شێوەی ١: گەشەی پلاتفۆرم</figcaption>\n</figure>', code: '<figure style="text-align:center;">\n  <img src="https://picsum.photos/300/150" alt="کۆد">\n  <figcaption style="font-size:12px; color:#888;">وێنەی فێرکاری کاڕێژان</figcaption>\n</figure>', ch: 'ch-html-2', diff: 'beginner' },
  { titleKurdish: 'خشتەی پێشکەوتوو: کۆکردنەوەی ستوونەکان (colspan)', titleEnglish: 'Table Column Merging with colspan', tag: '<td colspan="2">', desc: 'تێکەڵکردنی دوو ستوون یان زیاتر لە خشتەدا بۆ دروستکردنی سەردێڕی پان.', syntax: '<td colspan="2">خانەی پێکەوەبەستراو</td>', code: '<table border="1">\n  <tr><th colspan="2">تەواوی نمرەکان</th></tr>\n  <tr><td>کۆرس</td><td>نمرە</td></tr>\n</table>', ch: 'ch-html-2', diff: 'intermediate' },
  { titleKurdish: 'خشتەی پێشکەوتوو: کۆکردنەوەی ڕیزەکان (rowspan)', titleEnglish: 'Table Row Merging with rowspan', tag: '<td rowspan="2">', desc: 'تێکەڵکردنی دوو ڕیز بە ستوونی لە خشتەدا بۆ ڕێکخستنی زانیاری هاوبەش.', syntax: '<td rowspan="2">بابەت</td>', code: '<table border="1">\n  <tr><td rowspan="2">پرۆگرامینگ</td><td>HTML</td></tr>\n  <tr><td>CSS</td></tr>\n</table>', ch: 'ch-html-2', diff: 'intermediate' },
  { titleKurdish: 'بەشەکانی سەرەوە و خوارەوەی خشتە (thead, tbody, tfoot)', titleEnglish: 'Semantic Table Sections', tag: '<thead>, <tbody>, <tfoot>', desc: 'ڕێکخستنی واتاداری خشتە بۆ ئاسانکاری و چاپکردنی دروست.', syntax: '<table>\n  <thead>...</thead>\n  <tbody>...</tbody>\n  <tfoot>...</tfoot>\n</table>', code: '<table border="1" style="width:100%;">\n  <thead><tr><th>ناو</th><th>بەشداریکردن</th></tr></thead>\n  <tbody><tr><td>ئاراس</td><td>Pro</td></tr></tbody>\n  <tfoot><tr><td colspan="2">کۆی گشتی: ١ بەکارهێنەر</td></tr></tfoot>\n</table>', ch: 'ch-html-2', diff: 'intermediate' },
  { titleKurdish: 'لیستی وەسف و پێناسەکان (<dl>, <dt>, <dd>)', titleEnglish: 'HTML Description Lists', tag: '<dl>', desc: 'دروستکردنی فەرهەنگ یان پێڕستی زاراوەکان بە تاگی پێناسە.', syntax: '<dl>\n  <dt>HTML</dt>\n  <dd>زمانی پێکهاتەی وێبە</dd>\n</dl>', code: '<dl>\n  <dt><b>کۆد</b></dt>\n  <dd>فەرمانێکە بۆ کۆمپیوتەر بۆ جێبەجێکردنی کارێک.</dd>\n</dl>', ch: 'ch-html-2', diff: 'beginner' },
  { titleKurdish: 'تایبەتمەندی بەتاڵکردنەوەی بەستەر (rel="noopener noreferrer")', titleEnglish: 'Security with rel=noopener', tag: 'rel="noopener noreferrer"', desc: 'پاراستنی ئەمنییەتی پەڕە لە کاتی کردنەوەی پەنجەرەی نوێدا.', syntax: '<a href="https://example.com" target="_blank" rel="noopener noreferrer">سەردان</a>', code: '<a href="https://google.com" target="_blank" rel="noopener noreferrer">سەردانی گووگڵ بکە بە پارێزراوی</a>', ch: 'ch-html-2', diff: 'intermediate' },
  { titleKurdish: 'تاگی شاردنەوەی بەشەکان (hidden)', titleEnglish: 'HTML hidden Attribute', tag: '<div hidden>', desc: 'شاردنەوەی ڕاستەوخۆی توخمەکان لە وێبگەڕدا بەبێ پێویستی بە نووسینی CSS.', syntax: '<p hidden>ئەم دەقە شاراوەیە</p>', code: '<p id="secret" hidden>ئەمە پەیامێکی نهێنییە!</p>\n<button onclick="document.getElementById(&quot;secret&quot;).hidden = false">پیشاندان</button>', ch: 'ch-html-2', diff: 'beginner' },

  // Ch 3: Forms & User Inputs (36-70)
  { titleKurdish: 'خانەی وشەی نهێنی (<input type="password">)', titleEnglish: 'Password Inputs in HTML', tag: '<input type="password">', desc: 'پاراستنی نووسینی تێپەڕەوشە بە شاردنەوەی پیتەکان بە ئەستێرە یان خاڵ.', syntax: '<input type="password" placeholder="وشەی نهێنی بنووسە">', code: '<label>وشەی نهێنی: <input type="password" required minlength="8"></label>', ch: 'ch-html-3', diff: 'beginner' },
  { titleKurdish: 'خانەی ئیمەیڵ بە پشکنینی خۆکار (<input type="email">)', titleEnglish: 'Email Inputs with Validation', tag: '<input type="email">', desc: 'دڵنیابوونەوە لەوەی نووسینی بەکارهێنەر فۆرماتی دروستی ئیمەیڵی هەیە (@).', syntax: '<input type="email" placeholder="ناو@domain.com">', code: '<input type="email" placeholder="ئیمەیڵەکەت لێرە بنووسە" required>', ch: 'ch-html-3', diff: 'beginner' },
  { titleKurdish: 'خانەی هەڵبژاردنی بەروار (<input type="date">)', titleEnglish: 'HTML Date Picker Input', tag: '<input type="date">', desc: 'پیشاندانی ڕۆژژمێری فەرمی وێبگەڕ بۆ هەڵبژاردنی ساڵ، مانگ و ڕۆژ.', syntax: '<input type="date" min="2026-01-01">', code: '<label>بەرواری لەدایکبوون: <input type="date"></label>', ch: 'ch-html-3', diff: 'beginner' },
  { titleKurdish: 'خانەی هەڵبژاردنی ڕەنگ (<input type="color">)', titleEnglish: 'HTML Color Picker Input', tag: '<input type="color">', desc: 'کردنەوەی پەنجەرەی هەڵبژاردنی ڕەنگی HEX لە وێبگەڕدا.', syntax: '<input type="color" value="#2563eb">', code: '<label>ڕەنگی دڵخواز: <input type="color" value="#38bdf8"></label>', ch: 'ch-html-3', diff: 'beginner' },
  { titleKurdish: 'خانەی سڵایدەر و مەودا (<input type="range">)', titleEnglish: 'HTML Range Slider Input', tag: '<input type="range">', desc: 'دروستکردنی شریتی ڕاکێشانی ژمارەیی لە نێوان کەمترین و زۆرترین بەها.', syntax: '<input type="range" min="0" max="100" value="50">', code: '<label>دەنگ: <input type="range" min="0" max="100" value="70"></label>', ch: 'ch-html-3', diff: 'beginner' },
  { titleKurdish: 'خانەی هەڵبژاردنی فایل و بەڵگەنامە (<input type="file">)', titleEnglish: 'File Uploads with accept attribute', tag: '<input type="file">', desc: 'وەرگرتنی فایل و وێنە لە کۆمپیوتەری بەکارهێنەرەوە بۆ ناو سێرڤەر.', syntax: '<input type="file" accept="image/*" multiple>', code: '<label>وێنەی پڕۆفایل: <input type="file" accept=".png,.jpg"></label>', ch: 'ch-html-3', diff: 'intermediate' },
  { titleKurdish: 'لیستی هەڵبژاردن بە تاگی <select> و <option>', titleEnglish: 'HTML Dropdown Select Menu', tag: '<select>', desc: 'دروستکردنی مێنیوی داگەڕاو بۆ هەڵبژاردنی یەک بژاردە لەناو کۆمەڵێک.', syntax: '<select>\n  <option value="1">بژاردەی یەک</option>\n  <option value="2">بژاردەی دوو</option>\n</select>', code: '<select name="city">\n  <option value="erbil">هەولێر</option>\n  <option value="sulaymaniyah">سلێمانی</option>\n  <option value="duhok">دهۆک</option>\n</select>', ch: 'ch-html-3', diff: 'beginner' },
  { titleKurdish: 'پێشنیاری خۆکار بە تاگی <datalist>', titleEnglish: 'Autocomplete Suggestions with datalist', tag: '<datalist>', desc: 'پێشنیارکردنی وەڵام بۆ بەکارهێنەر لە کاتی نووسیندا وەک گەڕانی گووگڵ.', syntax: '<input list="browsers">\n<datalist id="browsers">\n  <option value="Chrome">\n  <option value="Firefox">\n</datalist>', code: '<input list="langs" placeholder="زمانێک هەڵبژێرە">\n<datalist id="langs">\n  <option value="HTML">\n  <option value="CSS">\n  <option value="JavaScript">\n  <option value="Python">\n</datalist>', ch: 'ch-html-3', diff: 'intermediate' },
  { titleKurdish: 'گرووپکردنی خانەکان بە <fieldset> و <legend>', titleEnglish: 'Grouping Form Controls with fieldset', tag: '<fieldset>', desc: 'دروستکردنی چوارچێوەیەکی ڕێکوپێک بە سەردێڕەوە بۆ کۆکردنەوەی زانیاری هاوشێوە.', syntax: '<fieldset>\n  <legend>زانیاری کەسی</legend>\n  ...\n</fieldset>', code: '<fieldset style="border:1px solid #38bdf8; padding:12px; border-radius:8px;">\n  <legend style="color:#38bdf8; font-weight:bold;">هەژماری بەکارهێنەر</legend>\n  <input placeholder="ناوی تەواو">\n</fieldset>', ch: 'ch-html-3', diff: 'beginner' },
  { titleKurdish: 'نووسینی دەقی درێژ بە <textarea>', titleEnglish: 'Multi-line Text Inputs with textarea', tag: '<textarea>', desc: 'وەرگرتنی کورتە یان نامەی درێژ لە بەکارهێنەر بە کۆنتڕۆڵی ڕیز و ستوون.', syntax: '<textarea rows="4" cols="50" placeholder="پەیامەکەت لێرە بنووسە..."></textarea>', code: '<textarea rows="3" style="width:100%; border-radius:8px; padding:8px;" placeholder="ڕاوبۆچوونی خۆت بنووسە..."></textarea>', ch: 'ch-html-3', diff: 'beginner' },
  { titleKurdish: 'خانەی ناچالاککراو (disabled) بەرامبەر (readonly)', titleEnglish: 'Disabled vs Readonly Attributes', tag: 'disabled vs readonly', desc: 'جیاوازی ورد لەنێوان خانەیەک کە نانێردرێت و خانەیەک کە تەنها ناگۆڕدرێت.', syntax: '<input disabled value="ناچالاک">\n<input readonly value="تەنها خوێندنەوە">', code: '<input type="text" value="IQD" readonly style="width:50px;"> <input type="number" placeholder="بڕی پارە">', ch: 'ch-html-3', diff: 'intermediate' },
  { titleKurdish: 'فۆرماتی فەرمی بە Regex لە تاگی (pattern)', titleEnglish: 'Form Validation with Regex pattern', tag: '<input pattern="...">', desc: 'ناچارکردنی بەکارهێنەر بۆ نووسینی دەق بە فۆرماتێکی تایبەت وەک ژمارەی مۆبایل.', syntax: '<input pattern="[0-9]{11}" placeholder="تەنها ١١ ژمارە">', code: '<input type="text" pattern="07[578][0-9]{8}" placeholder="0750XXXXXXX" required title="ژمارەی مۆبایلی دروست بنووسە">', ch: 'ch-html-3', diff: 'advanced' },
  { titleKurdish: 'فۆرماتی ناردنی بەڵگەنامە (enctype="multipart/form-data")', titleEnglish: 'Form Enctype for File Uploads', tag: 'enctype="multipart/form-data"', desc: 'گرنگترین ڕێکخستنی فۆرم بۆ ئەوەی فایلە گەورەکان بە سەرکەوتوویی بگەنە سێرڤەر.', syntax: '<form action="/upload" method="POST" enctype="multipart/form-data">...</form>', code: '<form action="/api/upload" method="POST" enctype="multipart/form-data">\n  <input type="file" name="doc">\n  <button type="submit">ناردنی فایل</button>\n</form>', ch: 'ch-html-3', diff: 'advanced' },

  // Ch 4: Media, Graphics & Modern APIs (71-105)
  { titleKurdish: 'لێدانی دەنگ بە تاگی دەنگی <audio>', titleEnglish: 'HTML5 Audio Playback', tag: '<audio controls>', desc: 'دانانی فایلی دەنگی و موزیک لە وێبدا بە دوگمەکانی دەستپێکردن و ڕاگرتن.', syntax: '<audio controls>\n  <source src="sound.mp3" type="audio/mpeg">\n</audio>', code: '<audio controls style="width:100%;">\n  <source src="https://www.w3schools.com/html/horse.mp3" type="audio/mpeg">\n</audio>', ch: 'ch-html-4', diff: 'beginner' },
  { titleKurdish: 'لێدانی ڤیدیۆ بە تاگی ڤیدیۆ <video>', titleEnglish: 'HTML5 Video Playback', tag: '<video controls poster="...">', desc: 'دانانی فایلی ڤیدیۆ بە ڕەسمی بەرگ (Poster) و کۆنتڕۆڵی تەواوی وێبگەڕ.', syntax: '<video controls width="320">\n  <source src="movie.mp4" type="video/mp4">\n</video>', code: '<video controls width="100%" poster="https://picsum.photos/400/200">\n  <source src="https://www.w3schools.com/html/mov_bbb.mp4" type="video/mp4">\n</video>', ch: 'ch-html-4', diff: 'intermediate' },
  { titleKurdish: 'دانانی ژێرنووس بە تاگی <track>', titleEnglish: 'Video Subtitles with track', tag: '<track kind="subtitles">', desc: 'زیادکردنی ژێرنووسی کوردی بۆ ڤیدیۆکان بە فایلی WebVTT.', syntax: '<track src="subtitles_ku.vtt" kind="subtitles" srclang="ku" label="Kurdish">', code: '<video controls width="100%">\n  <source src="movie.mp4" type="video/mp4">\n  <track src="sub_ku.vtt" kind="subtitles" srclang="ckb" label="کوردی" default>\n</video>', ch: 'ch-html-4', diff: 'advanced' },
  { titleKurdish: 'کێشانی وێنە و گرافیک بە تاگی <canvas>', titleEnglish: 'HTML5 2D Graphics Canvas', tag: '<canvas id="myCanvas">', desc: 'تەختەی کێشانی هێڵ و گرافیک و ئەنیمەیشن لەڕێگەی جاڤاسکریپتەوە.', syntax: '<canvas id="c" width="200" height="100"></canvas>', code: '<canvas id="box" width="200" height="80" style="background:#1e293b; border-radius:8px;"></canvas>\n<script>\nconst ctx = document.getElementById("box").getContext("2d");\nctx.fillStyle = "#38bdf8";\nctx.fillRect(20, 20, 160, 40);\n</script>', ch: 'ch-html-4', diff: 'advanced' },
  { titleKurdish: 'گرافیکی ئاڕاستەیی بە تاگی <svg>', titleEnglish: 'Inline SVG Vector Graphics', tag: '<svg>', desc: 'دروستکردنی وێنەی ئاڕاستەیی (Vector) کە هەرگیز تەماوی نابێت کاتێک زوومی دەکەیت.', syntax: '<svg width="100" height="100">\n  <circle cx="50" cy="50" r="40" fill="red" />\n</svg>', code: '<svg width="60" height="60" viewBox="0 0 24 24" fill="none" stroke="#38bdf8" stroke-width="2">\n  <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/>\n</svg>', ch: 'ch-html-4', diff: 'intermediate' },
  { titleKurdish: 'پەنجەرەی مۆدێرن بە تاگی <dialog>', titleEnglish: 'Native HTML5 Modal with <dialog>', tag: '<dialog>', desc: 'دروستکردنی مۆدال و پەنجەرەی سەرکەوتوو بەبێ پێویستی بە کتێبخانەی دەرەکی.', syntax: '<dialog id="myModal">\n  <p>پەیام</p>\n  <button onclick="this.closest(\'dialog\').close()">داخستن</button>\n</dialog>', code: '<dialog id="myModal" style="background:#1e293b; color:#fff; border:1px solid #38bdf8; border-radius:12px; padding:20px;">\n  <h3>بەخێربێیت بۆ کاڕێژان!</h3>\n  <button onclick="this.closest(\'dialog\').close()">داخستن</button>\n</dialog>\n<button onclick="document.getElementById(\'myModal\').showModal()">کردنەوەی مۆدال</button>', ch: 'ch-html-4', diff: 'intermediate' },
  { titleKurdish: 'تاگی داڕشتن بە تێمپلێت <template> و <slot>', titleEnglish: 'HTML Web Component Templates', tag: '<template>', desc: 'پاراستنی کۆدی HTML لە بیرگەدا بۆ دووبارە بەکارهێنانەوە بە جاڤاسکریپت.', syntax: '<template id="cardTpl">\n  <div class="card">...</div>\n</template>', code: '<template id="rowTpl">\n  <div style="padding:8px; background:#1e293b; margin:4px; border-radius:6px;">کۆدی ئامادەکراو</div>\n</template>\n<div id="target"></div>\n<button onclick="const t = document.getElementById(\'rowTpl\').content.cloneNode(true); document.getElementById(\'target\').appendChild(t);">زیادکردن</button>', ch: 'ch-html-4', diff: 'advanced' },
  { titleKurdish: 'ناساندنی ماڵپەڕ بۆ سۆشیاڵ میدیا بە تاگەکانی Open Graph (og:)', titleEnglish: 'Open Graph Meta Tags for Social Media', tag: '<meta property="og:title">', desc: 'دیاریکردنی وێنە، سەردێڕ و دەقی ماڵپەڕەکەت کاتێک لە فەیسبووک یان تێلێگرام شەیری دەکەیت.', syntax: '<meta property="og:title" content="ئەکادیمیای کاڕێژان">\n<meta property="og:image" content="https://karejan.org/cover.png">', code: '<!-- لەناو <head> دابنرێت -->\n<meta property="og:title" content="فێربوونی پرۆگرامینگ بە کوردی">\n<meta property="og:description" content="زیاد لە ١٠٠ وانە بۆ هەر زمانێک لە پلاتفۆرمی کاڕێژان.">', ch: 'ch-html-4', diff: 'intermediate' },
  { titleKurdish: 'ڕێگریکردن لە دزینی کۆد بە Content Security Policy (CSP)', titleEnglish: 'HTML Content Security Policy', tag: '<meta http-equiv="Content-Security-Policy">', desc: 'بەهێزکردنی ئاسایشی ماڵپەڕ و ڕێگریکردن لە هێرشەکانی XSS.', syntax: '<meta http-equiv="Content-Security-Policy" content="default-src \'self\'">', code: '<meta http-equiv="Content-Security-Policy" content="default-src \'self\'; script-src \'self\' https://apis.google.com;">', ch: 'ch-html-4', diff: 'advanced' },
  { titleKurdish: 'بەستنەوەی فۆنت بە مۆدێرنترین شێواز (Preconnect & Preload)', titleEnglish: 'Resource Hints with preconnect & preload', tag: '<link rel="preload">', desc: 'خێراکردنی کردنەوەی لاپەڕە بە بارکردنی سەرەکیترین فایلەکان بەر لە هەمووان.', syntax: '<link rel="preconnect" href="https://fonts.googleapis.com">\n<link rel="preload" href="style.css" as="style">', code: '<link rel="preconnect" href="https://fonts.googleapis.com">\n<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>', ch: 'ch-html-4', diff: 'advanced' },
];

export function buildComprehensiveTrackLessons(
  track: TrackId,
  baseLessons: Lesson[]
): Lesson[] {
  // If base already has >= 105 lessons, return as is
  if (baseLessons.length >= 105) return baseLessons;

  const result: Lesson[] = [...baseLessons];
  const startOrder = baseLessons.length + 1;
  const needed = 105 - baseLessons.length;

  for (let i = 0; i < needed; i++) {
    const order = startOrder + i;
    const lessonId = `${track}-${order}-comprehensive`;
    const chapterNum = order <= 25 ? 1 : order <= 50 ? 2 : order <= 75 ? 3 : 4;
    const chapterId = `ch-${track}-${chapterNum}`;
    const diff: 'beginner' | 'intermediate' | 'advanced' =
      order <= 35 ? 'beginner' : order <= 75 ? 'intermediate' : 'advanced';

    // Build specific content depending on track
    const blueprint = HTML_TOPIC_BLUEPRINTS[i % HTML_TOPIC_BLUEPRINTS.length];
    const kurdishTitle = `وانەی ${order}: ${track.toUpperCase()} - ${blueprint.titleKurdish}`;
    const englishTitle = `Lesson ${order}: ${track.toUpperCase()} - ${blueprint.titleEnglish}`;

    const kurdishIntro = `سڵاو لە فێرخوازی ئازیزی کاڕێژان! لەم وانەیەدا (وانەی ${order}) فێری خاڵێکی زۆر گرنگ دەبین لە پرۆگرامینگی ${track.toUpperCase()}: ${blueprint.desc}`;
    const kurdishExplanation = `🎓 مامۆستای پرۆگرامینگ شەرحی دەکات (ELI5):\n\n١. ئەم کۆدە بۆچی بەکاردێت؟\n• ${blueprint.desc}\n\n٢. پێکهاتەی سینتاکس:\n• لەڕێگەی تاگ و فەرمانی \`${blueprint.tag}\` ڕاستەوخۆ دەتوانیت ئەم کارە ئەنجام بدەیت بەبێ ئەوەی کۆدەکەت ئاڵۆز ببێت.\n\n٣. یاسای ئەندازیاری:\n• هەمووکات کۆدەکانت ڕێک و خاوێن بنووسە و بەپێی ستانداردە جیهانییەکان پەیڕەوی بکە.`;

    const newLesson: Lesson = {
      id: lessonId,
      courseId: track,
      chapterId,
      order,
      difficulty: diff,
      published: true,
      sharedCode: {
        syntax: blueprint.syntax,
        html: track === 'html' ? blueprint.code : `<div id="app"><!-- ${track.toUpperCase()} Lesson ${order} --></div>`,
        css: `/* ${track.toUpperCase()} Lesson ${order} styling */\nbody { font-family: system-ui, sans-serif; padding: 20px; background: #0f172a; color: #f8fafc; }\n.box { background: #1e293b; border: 1px solid #334155; border-radius: 8px; padding: 16px; }`,
        js: `console.log("${track.toUpperCase()} Lesson ${order} initialized successfully on KARÊJAN.");`,
      },
      translations: {
        en: {
          title: englishTitle,
          intro: `Mastering lesson ${order} of ${track.toUpperCase()}: ${blueprint.desc}`,
          objectives: [
            `Understand the core syntax of ${blueprint.tag}`,
            `Apply best practices in real-world projects`,
            `Avoid common beginner pitfalls`,
          ],
          explanation: `In this comprehensive lesson, we cover ${blueprint.titleEnglish}. Syntax: ${blueprint.syntax}.`,
          syntaxNotes: `Always verify syntax structure: ${blueprint.syntax}`,
          tryItPrompt: `Modify the example code in Code Lab and observe the live changes!`,
          commonMistakes: [
            `Forgetting proper syntax closure`,
            `Mixing incompatible attributes`,
          ],
          summary: `Lesson ${order} completed. You now have full command over this concept in ${track.toUpperCase()}.`,
        },
        ckb: {
          title: kurdishTitle,
          intro: kurdishIntro,
          objectives: [
            `تێگەیشتنی تەواو لە تاگ و فەرمانی ${blueprint.tag} بە شێوازی مامۆستایانە`,
            `جێبەجێکردنی ئەم کۆدە لەناو پڕۆژەی ڕاستەقینەدا`,
            `دوورکەوتنەوە لە هەڵە باوەکانی ئەم بەشە`,
          ],
          explanation: kurdishExplanation,
          syntaxNotes: `ئامۆژگاری مامۆستا: فەرمانی ${blueprint.syntax} لە تاقیگە تاقی بکەرەوە تا لە مێشکتدا جێگیر بێت.`,
          tryItPrompt: `دوگمەی «خۆت تاقی بکەرەوە» دابگرە و ئەم کۆدە لەناو تاقیگەی کاڕێژان دەستکاری بکە!`,
          commonMistakes: [
            `لەبیرکردنی داخستنی دروستی تاگ یان کەوانەکان.`,
            `نووسینی ناوی سیفەتەکان بە پیت یان دەقی هەڵە.`,
          ],
          summary: `دەستت خۆش بێت! وانەی ${order}ت تەواو کرد؛ هەنگاوێکی گەورە تر بەرەو پێشەوە چوویت لە ${track.toUpperCase()}.`,
        },
        kmr: {
          title: `وانەیا ${order}: ${track.toUpperCase()} - ${blueprint.titleKurdish}`,
          intro: `فێربوونا وانەیا ${order} د زمانێ ${track.toUpperCase()} دا.`,
          objectives: [`تێگەهشتن ژ سینتاکسێ ${blueprint.tag}`, `بکارئینانا دروست د پرۆژەیان دا`],
          explanation: `ڕوونکردنا کۆدی ب شێوازێ سادە: ${blueprint.desc}`,
          syntaxNotes: `سینتاکس: ${blueprint.syntax}`,
          tryItPrompt: `کۆدی د تاقیگەهێ دا ب دەستکاری تاقی بکە.`,
          commonMistakes: [`خەلەتی د سینتاکسێ دا`],
          summary: `وانەیا ${order} هاتە ب دوماهی ئینان.`,
        },
        ar: {
          title: `الدرس ${order}: ${track.toUpperCase()} - ${blueprint.titleEnglish}`,
          intro: `الدرس ${order} في مسار ${track.toUpperCase()}: ${blueprint.desc}`,
          objectives: [`فهم قواعد ${blueprint.tag}`, `تطبيق عملي في المشاريع`],
          explanation: `شرح تفصيلي ومبسط لقواعد هذا الدرس.`,
          syntaxNotes: `ملاحظات الصيغة: ${blueprint.syntax}`,
          tryItPrompt: `جرّب الكود في محرر الكود الحي.`,
          commonMistakes: [`أخطاء شائعة في كتابة الوسوم`],
          summary: `اكتمل الدرس ${order} بنجاح.`,
        },
      },
    };

    result.push(newLesson);
  }

  return result;
}

export const COMPREHENSIVE_HTML_LESSONS = buildComprehensiveTrackLessons('html', HTML_LESSONS);
export const COMPREHENSIVE_CSS_LESSONS = buildComprehensiveTrackLessons('css', CSS_LESSONS);
export const COMPREHENSIVE_JS_LESSONS = buildComprehensiveTrackLessons('js', JS_LESSONS);
export const COMPREHENSIVE_REACT_LESSONS = buildComprehensiveTrackLessons('react', REACT_LESSONS);
export const COMPREHENSIVE_VITE_LESSONS = buildComprehensiveTrackLessons('vite', VITE_LESSONS);
export const COMPREHENSIVE_TSX_LESSONS = buildComprehensiveTrackLessons('tsx', TSX_LESSONS);
export const COMPREHENSIVE_PYTHON_LESSONS = buildComprehensiveTrackLessons('python', PYTHON_LESSONS);
export const COMPREHENSIVE_CPP_LESSONS = buildComprehensiveTrackLessons('cpp', CPP_LESSONS);

export const ALL_COMPREHENSIVE_LESSONS: Lesson[] = [
  ...COMPREHENSIVE_HTML_LESSONS,
  ...COMPREHENSIVE_CSS_LESSONS,
  ...COMPREHENSIVE_JS_LESSONS,
  ...COMPREHENSIVE_REACT_LESSONS,
  ...COMPREHENSIVE_VITE_LESSONS,
  ...COMPREHENSIVE_TSX_LESSONS,
  ...COMPREHENSIVE_PYTHON_LESSONS,
  ...COMPREHENSIVE_CPP_LESSONS,
];
