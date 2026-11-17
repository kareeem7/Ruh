/* ============================================================
   js/data.js — طبقة البيانات الوحيدة المصدر
   كل اللي تحته شكله زي ما الـ API هيرجعه — لو حابب تربط باك إند
   بدّل المصفوفات دي بـ fetch والـ UI مش هيحتاج أي تعديل
============================================================ */
'use strict';

/* الصور (Pexels CDN — بدّلها بصورك) */
const IMG = {
  shHang:'https://images.pexels.com/photos/22441297/pexels-photo-22441297.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=1200&w=800',
  shHang2:'https://images.pexels.com/photos/22441291/pexels-photo-22441291.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=1200&w=800',
  wWhite:'https://images.pexels.com/photos/17907026/pexels-photo-17907026.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=1200&w=800',
  wOversize:'https://images.pexels.com/photos/40241999/pexels-photo-40241999.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=1200&w=800',
  mBeige:'https://images.pexels.com/photos/17251247/pexels-photo-17251247.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=1200&w=800',
  wKhaki:'https://images.pexels.com/photos/40242006/pexels-photo-40242006.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=1200&w=800',
  mLinen:'https://images.pexels.com/photos/33189240/pexels-photo-33189240.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=1200&w=800',
  wBeach:'https://images.pexels.com/photos/33814048/pexels-photo-33814048.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=1200&w=800',
  handBeige:'https://images.pexels.com/photos/6694760/pexels-photo-6694760.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=1200&w=800',
  wBlouse:'https://images.pexels.com/photos/40242001/pexels-photo-40242001.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=1200&w=800',
  knit1:'https://images.pexels.com/photos/5789582/pexels-photo-5789582.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=1200&w=800',
  knit2:'https://images.pexels.com/photos/18645864/pexels-photo-18645864.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=1200&w=800',
  mKnit:'https://images.pexels.com/photos/5755039/pexels-photo-5755039.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=1200&w=800',
  knitFold:'https://images.pexels.com/photos/14642653/pexels-photo-14642653.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=1200&w=800',
  grayCrew:'https://images.pexels.com/photos/9594147/pexels-photo-9594147.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=1200&w=800',
  croc:'https://images.pexels.com/photos/35568701/pexels-photo-35568701.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=1200&w=800',
  mDenim:'https://images.pexels.com/photos/8346220/pexels-photo-8346220.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=1200&w=800',
  mCroc:'https://images.pexels.com/photos/35568697/pexels-photo-35568697.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=1200&w=800',
  hBook:'https://images.pexels.com/photos/30775388/pexels-photo-30775388.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=1200&w=800',
  hDoor:'https://images.pexels.com/photos/32098767/pexels-photo-32098767.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=1200&w=800',
  hCoat:'https://images.pexels.com/photos/32407927/pexels-photo-32407927.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=1200&w=800',
  hDoorB:'https://images.pexels.com/photos/8217840/pexels-photo-8217840.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=1200&w=800',
  hPost:'https://images.pexels.com/photos/2050690/pexels-photo-2050690.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=1200&w=800',
  hOut:'https://images.pexels.com/photos/30775416/pexels-photo-30775416.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=1200&w=800',
  hDoorO:'https://images.pexels.com/photos/8217846/pexels-photo-8217846.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=1200&w=800',
  hWalk:'https://images.pexels.com/photos/33600455/pexels-photo-33600455.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=1200&w=800',
  belts:'https://images.pexels.com/photos/7679471/pexels-photo-7679471.jpeg?auto=compress&cs=tinysrgb&fit=crop&w=940&h=1250',
  flat:'https://images.pexels.com/photos/322207/pexels-photo-322207.jpeg?auto=compress&cs=tinysrgb&fit=crop&w=940&h=1250',
  pack:'https://images.pexels.com/photos/9595290/pexels-photo-9595290.jpeg?auto=compress&cs=tinysrgb&fit=crop&w=940&h=1250',
  buckle:'https://images.pexels.com/photos/13693460/pexels-photo-13693460.jpeg?auto=compress&cs=tinysrgb&fit=crop&w=940&h=1250',
  bags:'https://images.pexels.com/photos/9595079/pexels-photo-9595079.jpeg?auto=compress&cs=tinysrgb&fit=crop&w=940&h=1250',
  belts2:'https://images.pexels.com/photos/7679660/pexels-photo-7679660.jpeg?auto=compress&cs=tinysrgb&fit=crop&w=940&h=1250',
  hero:'https://images.pexels.com/photos/8995846/pexels-photo-8995846.jpeg?auto=compress&cs=tinysrgb&fit=crop&w=2000&h=1160',
  edit:'https://images.pexels.com/photos/8995939/pexels-photo-8995939.jpeg?auto=compress&cs=tinysrgb&fit=crop&w=1400&h=1100',
  pjSet:'https://images.pexels.com/photos/40242000/pexels-photo-40242000.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=1200&w=800',
  jacket:'https://images.pexels.com/photos/19113854/pexels-photo-19113854.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=1200&w=800',
  coatW:'https://images.pexels.com/photos/6700347/pexels-photo-6700347.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=1200&w=800',
  khakiJ:'https://images.pexels.com/photos/19113849/pexels-photo-19113849.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=1200&w=800',
  shoot:'https://images.pexels.com/photos/7147595/pexels-photo-7147595.jpeg?auto=compress&cs=tinysrgb&fit=crop&w=1400&h=900',
  widePants:'https://images.pexels.com/photos/8487228/pexels-photo-8487228.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=1200&w=800',
  sepia:'https://images.pexels.com/photos/40242004/pexels-photo-40242004.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=1200&w=800',
  trench:'https://images.pexels.com/photos/8358796/pexels-photo-8358796.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=1200&w=800',
  sew1:'https://images.pexels.com/photos/4622205/pexels-photo-4622205.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=1200&w=900',
  sew2:'https://images.pexels.com/photos/21855757/pexels-photo-21855757.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=1200&w=900',
  sew3:'https://images.pexels.com/photos/7147595/pexels-photo-7147595.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=1200&w=900',
  sew4:'https://images.pexels.com/photos/6461156/pexels-photo-6461156.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=1200&w=900',
  sew5:'https://images.pexels.com/photos/8030153/pexels-photo-8030153.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=1200&w=900',
  sew6:'https://images.pexels.com/photos/5830642/pexels-photo-5830642.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=1200&w=900'
};

/* ألوان القطع (سواتش) */
const C = {
  ivory:{ar:'عاجي',en:'Ivory',c:'#EDE6D8'}, sand:{ar:'رملي',en:'Sand',c:'#D8C3A5'}, clay:{ar:'طيني',en:'Clay',c:'#B4704B'},
  coal:{ar:'فحمي',en:'Coal',c:'#26231F'}, olive:{ar:'زيتوني',en:'Olive',c:'#6B7355'}, mint:{ar:'نعناعي',en:'Mint',c:'#B8C4B0'},
  white:{ar:'أبيض',en:'White',c:'#F6F4EE'}, black:{ar:'أسود',en:'Black',c:'#17150F'}, camel:{ar:'كاميل',en:'Camel',c:'#B98A5E'},
  copper:{ar:'نحاسي',en:'Copper',c:'#A5623B'}, sky:{ar:'سماوي',en:'Sky',c:'#AFC3CC'}, grey:{ar:'رمادي',en:'Grey',c:'#9B968E'},
  mauve:{ar:'موف',en:'Mauve',c:'#C1AEC0'}, brown:{ar:'بني',en:'Brown',c:'#7A5238'}, beige:{ar:'بيج',en:'Beige',c:'#D3C2AA'},
  natural:{ar:'طبيعي',en:'Natural',c:'#C9B08C'}, cloud:{ar:'سحابي',en:'Cloud',c:'#8C8F96'}
};

/* المنتجات الـ 24 */
const PRODUCTS = [
  {id:1, slug:'linen-shirt-ivory', name:'قميص كتان واسع – عاجي', en:'Wide Linen Shirt – Ivory', cat:'unisex', sub:'قمصان', subEn:'Shirts', price:1450, old:null, rating:4.9, rvws:214, badge:'new', fabric:'كتان أوروبي 100%', fabricEn:'100% European linen', imgs:[IMG.shHang,IMG.handBeige], colors:[C.ivory,C.sand,C.olive], sizes:{S:6,M:9,L:7,XL:3}, fit:'large', sold:320, desc:'قميص كتان قصّته واسعة بكتف نازل، بيتلبس على كل حاجة تقريبًا. الخامة بتتنفس في الحر وبيتنعّم أكتر مع كل غسلة.', descEn:'A wide-cut linen shirt with dropped shoulders. It breathes in heat and gets softer with every wash.', care:'غسيل مياه باردة · نشفه في الضل · كي متوسط وهو ندّي.', careEn:'Cold wash · shade dry · iron while damp.'},
  {id:2, slug:'pleated-pants-coal', name:'بنطلون قماش بليسيه – فحمي', en:'Pleated Trousers – Coal', cat:'women', sub:'بناطيل', subEn:'Pants', price:1290, old:null, rating:4.8, rvws:176, badge:null, fabric:'قطن مصري مخلوط', fabricEn:'Egyptian cotton blend', imgs:[IMG.widePants,IMG.wKhaki], colors:[C.coal,C.olive], sizes:{S:5,M:0,L:8,XL:2}, fit:null, sold:260, desc:'بليسيه أمامي ووسط مرتفع مريح. بيشدّ شكل الجسم من غير ما يقفل.', descEn:'Front pleats and a comfy high waist that flatters without squeezing.', care:'غسيل 30° مقلوب · كي من الداخل.', careEn:'30° inside-out wash · iron inside.'},
  {id:3, slug:'knit-pullover-clay', name:'بلوفر تريكو – طيني', en:'Knit Pullover – Clay', cat:'women', sub:'تريكو', subEn:'Knitwear', price:890, old:1150, rating:4.7, rvws:143, badge:'sale', fabric:'صوف مخلوط قطن', fabricEn:'Wool-cotton blend', imgs:[IMG.knit2,IMG.knit1], colors:[C.clay,C.ivory,C.grey], sizes:{S:3,M:2,L:0,XL:1}, fit:'small', sold:310, desc:'تريكو مضفور دافي من غير تقل. اللون الطيني اتصبغ خصيصًا لينا.', descEn:'Warm without bulk. The clay shade is dyed specially for us.', care:'غسيل يدوي بارد · يتفرش.', careEn:'Cold hand wash · dry flat.'},
  {id:4, slug:'linen-dress-sand', name:'فستان كتان – رملي', en:'Linen Dress – Sand', cat:'women', sub:'فساتين وتنانير', subEn:'Dresses & skirts', price:1890, old:null, rating:5.0, rvws:98, badge:'new', fabric:'كتان مغسول', fabricEn:'Washed linen', imgs:[IMG.hDoor,IMG.wBeach], colors:[C.sand,C.ivory], sizes:{S:2,M:4,L:3}, fit:null, sold:140, desc:'فستان ميدي بحركة حلوة في المشي، وسطه محدد بحزام من نفس القماش.', descEn:'A midi dress with a lovely sway, self-fabric belt at the waist.', care:'غسيل ناعم بارد · كي بخار.', careEn:'Gentle cold wash · steam iron.'},
  {id:5, slug:'oxford-shirt-white', name:'قميص أوكسفورد – أبيض', en:'Oxford Shirt – White', cat:'men', sub:'قمصان', subEn:'Shirts', price:1250, old:null, rating:4.8, rvws:201, badge:null, fabric:'قطن بيما', fabricEn:'Pima cotton', imgs:[IMG.mDenim,IMG.shHang2], colors:[C.white,C.sky], sizes:{S:8,M:12,L:10,XL:5,XXL:2}, fit:null, sold:420, desc:'القميص الأبيض اللي كل دولاب محتاجه. ياقة بتفضل واقفة وأزرار صدف.', descEn:'The white shirt every wardrobe needs. Sturdy collar, shell buttons.', care:'غسيل عادي 40° · كي ساخن.', careEn:'Regular 40° wash · hot iron.'},
  {id:6, slug:'chore-jacket-olive', name:'جاكيت تشور – زيتوني', en:'Chore Jacket – Olive', cat:'men', sub:'جاكيتات', subEn:'Jackets', price:2450, old:null, rating:4.9, rvws:87, badge:'new', fabric:'قطن تقيل مخلوط', fabricEn:'Heavy cotton blend', imgs:[IMG.jacket,IMG.khakiJ], colors:[C.olive,C.brown], sizes:{M:4,L:5,XL:2}, fit:null, sold:90, desc:'جاكيت ورشة بـ4 جيوب أمامية وخياطة مضلعة.', descEn:'4-pocket work jacket with triple-stitched seams.', care:'غسيل ناعم بارد · ميتنشفش في النشافة.', careEn:'Cold gentle wash · no tumble.'},
  {id:7, slug:'light-abaya-cloud', name:'عباية خفيفة – سحابي', en:'Light Abaya – Cloud', cat:'women', sub:'فساتين وتنانير', subEn:'Dresses & skirts', price:2190, old:null, rating:4.7, rvws:64, badge:null, fabric:'كريب خفيف', fabricEn:'Light crepe', imgs:[IMG.hWalk,IMG.hBook], colors:[C.cloud,C.black], sizes:{S:3,M:3,L:2}, fit:null, sold:75, desc:'عباية بقصّة مفتوحة بأزرار مخفية، قماشها طاير وخفيف.', descEn:'Open-front abaya with hidden buttons and a fabric that floats.', care:'غسيل يدوي أو دراي كلين خفيف.', careEn:'Hand wash or light dry clean.'},
  {id:8, slug:'pleated-skirt-camel', name:'تنورة ميدي بليسيه – كاميل', en:'Midi Pleated Skirt – Camel', cat:'women', sub:'فساتين وتنانير', subEn:'Dresses & skirts', price:990, old:1290, rating:4.6, rvws:88, badge:'sale', fabric:'بولي بليسيه ثابت', fabricEn:'Permanent-pleat poly', imgs:[IMG.coatW,IMG.sepia], colors:[C.camel,C.black], sizes:{S:4,M:5,L:2}, fit:null, sold:150, desc:'بليسيه مكوي حراري مش بيفك مع الغسيل. وسط مطاط مريح.', descEn:'Heat-set pleats that survive every wash. Comfy elastic waist.', care:'غسيل مقلوب 30°.', careEn:'Inside-out 30° wash.'},
  {id:9, slug:'pima-tee-basic', name:'تيشيرت قطن بيما – أساسي', en:'Pima Cotton Tee – Essential', cat:'unisex', sub:'تيشيرتات', subEn:'Tees', price:450, old:null, rating:4.9, rvws:480, badge:null, fabric:'قطن بيما', fabricEn:'Pima cotton', imgs:[IMG.grayCrew,IMG.mCroc], colors:[C.white,C.black,C.grey], sizes:{S:20,M:25,L:18,XL:9,XXL:4}, fit:null, sold:900, desc:'تيشيرت 220 جرام: مش شفاف ومش تقيل، والرقبة مبتفكش.', descEn:'220gsm tee: opaque but light, with a collar that keeps its shape.', care:'غسيل عادي · ينشف على الحبل.', careEn:'Regular wash · line dry.'},
  {id:10, slug:'linen-shirt-mint', name:'قميص كتان – نعناعي', en:'Linen Shirt – Mint', cat:'men', sub:'قمصان', subEn:'Shirts', price:1390, old:null, rating:4.7, rvws:132, badge:null, fabric:'كتان 100%', fabricEn:'100% linen', imgs:[IMG.mBeige,IMG.mLinen], colors:[C.mint,C.ivory], sizes:{S:6,M:8,L:0,XL:3}, fit:'large', sold:210, desc:'نفس قصّة القميص الواسع بلون نعناعي بيبان تحت الشمس.', descEn:'Same relaxed cut, in a mint shade that glows in the sun.', care:'بارد · ضل · كي ندّي.', careEn:'Cold · shade · damp iron.'},
  {id:11, slug:'linen-pants-beige', name:'بنطلون كتان واسع – بيج', en:'Wide Linen Pants – Beige', cat:'women', sub:'بناطيل', subEn:'Pants', price:1490, old:null, rating:4.8, rvws:159, badge:null, fabric:'كتان مخلوط', fabricEn:'Linen blend', imgs:[IMG.wOversize,IMG.wKhaki], colors:[C.beige,C.coal], sizes:{S:7,M:9,L:6,XL:2}, fit:null, sold:240, desc:'بنطلون واسع بوسط مرتفع ورباط داخلي، ينسدل بثقل حلو.', descEn:'Wide-leg with a high waist and inner drawstring, drapes just right.', care:'غسيل بارد · كي متوسط.', careEn:'Cold wash · medium iron.'},
  {id:12, slug:'knit-cardigan-ivory', name:'كارديغان تريكو – عاجي', en:'Knit Cardigan – Ivory', cat:'women', sub:'تريكو', subEn:'Knitwear', price:1690, old:null, rating:4.9, rvws:74, badge:null, fabric:'صوف ميرينو مخلوط', fabricEn:'Merino blend', imgs:[IMG.knitFold,IMG.croc], colors:[C.ivory,C.mauve], sizes:{S:2,M:3,L:2}, fit:'small', sold:60, desc:'كارديغان بأزرار قرن طبيعي وغرزة هاكة فيها روح.', descEn:'Real horn buttons and a stitch you can feel the care in.', care:'غسيل يدوي · يتفرش مش يتعلّق.', careEn:'Hand wash · dry flat.'},
  {id:13, slug:'satin-dress-copper', name:'فستان ساتان – نحاسي', en:'Satin Dress – Copper', cat:'women', sub:'فساتين وتنانير', subEn:'Dresses & skirts', price:2290, old:null, rating:4.8, rvws:57, badge:'new', fabric:'ساتان نباتي', fabricEn:'Plant-based satin', imgs:[IMG.hDoorO,IMG.hDoorB], colors:[C.copper,C.black], sizes:{S:2,M:2,L:1}, fit:null, sold:45, desc:'ساتان بلمعان هادي مش صارخ، قصّة باياس على الطول.', descEn:'Soft-shine satin, bias-cut for a long clean line.', care:'دراي كلين.', careEn:'Dry clean.'},
  {id:14, slug:'beach-shirt-sky', name:'قميص بيش قطن – سماوي', en:'Beach Cotton Shirt – Sky', cat:'men', sub:'قمصان', subEn:'Shirts', price:1150, old:null, rating:4.6, rvws:118, badge:null, fabric:'قطن مصري', fabricEn:'Egyptian cotton', imgs:[IMG.mLinen,IMG.mDenim], colors:[C.sky,C.white], sizes:{S:5,M:9,L:7,XL:4}, fit:'large', sold:170, desc:'قميص ياقة كوبانية بجيب صدر، قماشته خفيفة.', descEn:'Cuban collar with a chest pocket in an airy weave.', care:'غسيل عادي بارد.', careEn:'Regular cold wash.'},
  {id:15, slug:'linen-blazer-sand', name:'بليزر كتان – رملي', en:'Linen Blazer – Sand', cat:'men', sub:'جاكيتات', subEn:'Jackets', price:2790, old:3290, rating:4.9, rvws:63, badge:'sale', fabric:'كتان مصري خالص', fabricEn:'Pure Egyptian linen', imgs:[IMG.trench,IMG.mLinen], colors:[C.sand,C.olive], sizes:{M:2,L:3,XL:1}, fit:null, sold:55, desc:'بليزر غير مبطّن بالكامل عشان يفضل خفيف، كتفه طبيعي.', descEn:'Semi-lined for lightness, natural shoulder. Sharp without effort.', care:'دراي كلين.', careEn:'Dry clean.'},
  {id:16, slug:'linen-short-ivory', name:'شورت كتان – عاجي', en:'Linen Shorts – Ivory', cat:'unisex', sub:'بناطيل', subEn:'Pants', price:790, old:null, rating:4.7, rvws:96, badge:null, fabric:'كتان', fabricEn:'Linen', imgs:[IMG.wBeach,IMG.shHang2], colors:[C.ivory,C.olive], sizes:{S:5,M:7,L:4}, fit:null, sold:130, desc:'شورت فوق الركبة بوسط مطاط وجيوب كتير.', descEn:'Above-knee shorts, elastic waist, plenty of pockets.', care:'غسيل بارد.', careEn:'Cold wash.'},
  {id:17, slug:'linen-skirt-coal', name:'جيبة طويلة كتان – فحمي', en:'Long Linen Skirt – Coal', cat:'women', sub:'فساتين وتنانير', subEn:'Dresses & skirts', price:1190, old:null, rating:4.8, rvws:71, badge:null, fabric:'كتان', fabricEn:'Linen', imgs:[IMG.hCoat,IMG.hOut], colors:[C.coal,C.clay], sizes:{S:3,M:4,L:2,XL:1}, fit:null, sold:85, desc:'جيبة طويلة بفتحة جانبية محتشمة ووسط نص مطاط.', descEn:'Long skirt with a modest side slit and half-elastic waist.', care:'غسيل ناعم 30°.', careEn:'Gentle 30° wash.'},
  {id:18, slug:'hoodie-organic-grey', name:'هودي قطن عضوي – رمادي', en:'Organic Cotton Hoodie – Grey', cat:'men', sub:'تيشيرتات', subEn:'Tees', price:1250, old:null, rating:4.8, rvws:142, badge:null, fabric:'قطن عضوي مفرّش', fabricEn:'Brushed organic cotton', imgs:[IMG.mKnit,IMG.croc], colors:[C.grey,C.black], sizes:{M:6,L:8,XL:3,XXL:1}, fit:null, sold:190, desc:'هودي من قطن عضوي معتمد، فرشته الداخلية قطيفة.', descEn:'Certified organic cotton with a brushed fleece inside.', care:'غسيل مقلوب 30°.', careEn:'Inside-out 30° wash.'},
  {id:19, slug:'home-set-mauve', name:'طقم بيتي كتان – موف', en:'Linen Home Set – Mauve', cat:'women', sub:'بيتي', subEn:'Homewear', price:1690, old:1990, rating:4.9, rvws:66, badge:'sale', fabric:'كتان ناعم', fabricEn:'Soft linen', imgs:[IMG.pjSet,IMG.handBeige], colors:[C.mauve,C.ivory], sizes:{S:3,M:4,L:3}, fit:'large', sold:70, desc:'قميص وبنطلون كتان ناعمين للبيت بس شكلهم محترم.', descEn:'Softest linen for home — still presentable for surprise guests.', care:'غسيل ناعم بارد.', careEn:'Gentle cold wash.'},
  {id:20, slug:'linen-scarf-clay', name:'وشاح كتان – طيني', en:'Linen Scarf – Clay', cat:'acc', sub:'إكسسوارات', subEn:'Accessories', price:390, old:null, rating:4.8, rvws:54, badge:null, fabric:'كتان خفيف', fabricEn:'Light linen', imgs:[IMG.knit1,IMG.handBeige], colors:[C.clay,C.sand,C.olive], sizes:{OS:14}, fit:null, sold:150, desc:'وشاح 90×200 بأطراف منسولة شغل يدوي.', descEn:'90×200 scarf with hand-frayed edges.', care:'غسيل يدوي.', careEn:'Hand wash.'},
  {id:21, slug:'leather-belt-brown', name:'حزام جلد طبيعي – بني', en:'Leather Belt – Brown', cat:'acc', sub:'إكسسوارات', subEn:'Accessories', price:550, old:null, rating:4.9, rvws:88, badge:null, fabric:'جلد مدبوغ نباتي', fabricEn:'Veg-tan leather', imgs:[IMG.belts,IMG.belts2], colors:[C.brown,C.black], sizes:{OS:20}, fit:null, sold:200, desc:'حزام 3 سم بتجمّل مع الاستخدام، تكة نحاس مطفي.', descEn:'3cm belt that ages beautifully, matte brass buckle.', care:'يمسح بفوطة ندية.', careEn:'Wipe with a damp cloth.'},
  {id:22, slug:'canvas-tote-natural', name:'شنطة قماش – طبيعي', en:'Canvas Tote – Natural', cat:'acc', sub:'إكسسوارات', subEn:'Accessories', price:690, old:null, rating:4.7, rvws:61, badge:'new', fabric:'قماش قطن 16oz', fabricEn:'16oz cotton canvas', imgs:[IMG.buckle,IMG.pack], colors:[C.natural,C.black], sizes:{OS:9}, fit:null, sold:80, desc:'توت تشيل لابتوب 15 بوصة، جيب داخلي بسوستة ويد جلد.', descEn:'Fits a 15\" laptop, zipped inner pocket, leather handles.', care:'غسيل بقعي.', careEn:'Spot clean.'},
  {id:23, slug:'cotton-cap-olive', name:'كاب قطن – زيتوني', en:'Cotton Cap – Olive', cat:'acc', sub:'إكسسوارات', subEn:'Accessories', price:350, old:450, rating:4.6, rvws:49, badge:'sale', fabric:'قطن تويل', fabricEn:'Cotton twill', imgs:[IMG.flat,IMG.bags], colors:[C.olive,C.beige], sizes:{OS:12}, fit:null, sold:110, desc:'كاب بجنزير نحاس، متغسل فيبان مستعمل حلو من أول مرة.', descEn:'Brass strap adjuster; garment-washed so it feels broken-in.', care:'غسيل يدوي بارد.', careEn:'Cold hand wash.'},
  {id:24, slug:'cotton-socks-white', name:'جوارب قطن (٣ قطع) – أبيض', en:'Cotton Socks 3-Pack – White', cat:'acc', sub:'إكسسوارات', subEn:'Accessories', price:240, old:null, rating:4.8, rvws:133, badge:null, fabric:'قطن مخلوط', fabricEn:'Cotton blend', imgs:[IMG.knitFold,IMG.grayCrew], colors:[C.white], sizes:{OS:30}, fit:null, sold:300, desc:'٣ جوارب كرو بكعب ومقدمة مقوّيين.', descEn:'3 crew socks with reinforced heel and toe.', care:'غسيل 40°.', careEn:'40° wash.'}
];

/* إعدادات المتجر */
const CFG = {
  name:'RŪH', freeShip:1500, shipCairo:60, shipGov:90, pickup:0,
  bundleOff:.15, bundleIds:[1,11,20],
  coupons:{ 'ROOH10':{pct:.10} },
  cur:{ EGP:{r:1,s:'ج.م',d:0}, SAR:{r:.079,s:'ر.س',d:2}, AED:{r:.077,s:'د.إ',d:2}, USD:{r:.021,s:'$',d:2} },
  cats:{
    women:{ar:'نساء',en:'Women',img:IMG.wOversize},
    men:{ar:'رجال',en:'Men',img:IMG.mBeige},
    unisex:{ar:'يونيسكس',en:'Unisex',img:IMG.wKhaki},
    acc:{ar:'إكسسوارات',en:'Accessories',img:IMG.belts}
  },
  wa:'https://wa.me/201000000000'
};

/* محتوى الصفحة الرئيسية */
const TESTIMONIALS = [
  {name:'Mona El-Sayed', nameAr:'منى السيد', city:'Cairo', cityAr:'القاهرة', prod:1, rate:5, av:IMG.hPost, txt:'القميص العاجي بقى قطعتي المفضلة. الخامة تقيلة وفرشها حلو، بقالي شهرين بلابسه ولسه جديد.', txtEn:'The ivory shirt became my favourite piece. Two months of wear and it still looks brand new.'},
  {name:'Karim Abdel-Aziz', nameAr:'كريم عبد العزيز', city:'Alexandria', cityAr:'الإسكندرية', prod:5, rate:5, av:IMG.mBeige, txt:'طلبت بالدفع عند الاستلام ووصلني في يومين والتغليف تحفة. القصّة مظبوطة والقماش بيتنفس.', txtEn:'Ordered cash-on-delivery, arrived in two days with beautiful packaging. Cut and fabric both on point.'},
  {name:'Sara Mahmoud', nameAr:'سارة محمود', city:'Mansoura', cityAr:'المنصورة', prod:3, rate:4.5, av:IMG.hOut, txt:'البلوفر الطيني أحلى من الصور — بس خدوا بالكم مقاسه صغير شوية، خدت أكبر وطلع مظبوط.', txtEn:'The clay knit is nicer than the photos — note it runs small, I sized up and it was perfect.'},
  {name:'Youssef El-Naggar', nameAr:'يوسف النجار', city:'Giza', cityAr:'الجيزة', prod:15, rate:5, av:IMG.mLinen, txt:'البليزر ركّب زي التفصيل. سألتهم واتساب عن المقاس وردّوا في دقايق بنصيحة صح.', txtEn:'The blazer fits like tailoring. Asked about sizing on WhatsApp, got a fast useful answer.'}
];
const RATING_DIST = [[5,78],[4,15],[3,4],[2,2],[1,1]];
const PDP_REVIEWS = [
  {name:'Heba R.', city:'Cairo', rate:5, img:null, txt:'الخامة فاقت توقعاتي، والمقاس طلع زي الجدول بالظبط.', txtEn:'Fabric exceeded my expectations, size matches the chart exactly.'},
  {name:'Ahmed Sh.', city:'Alexandria', rate:5, img:IMG.sew5, txt:'التغليف محترم والتوصيل في معاده. الخياطة نضيفة جدًا.', txtEn:'Great packaging, on-time delivery, very clean stitching.'},
  {name:'Mariam A.', city:'Mansoura', rate:4, img:null, txt:'حلو جدًا واللون زي الصور، بس ياريت كان في مقاسات أكبر.', txtEn:'Lovely and true to photos, just wish bigger sizes existed.'},
  {name:'Omar F.', city:'Tanta', rate:5, img:null, txt:'تالت مرة أطلب، ومفيش مرة خيّبوا ظني.', txtEn:'Third order and they never let me down.'},
  {name:'Nourhan S.', city:'Cairo', rate:5, img:IMG.sew1, txt:'واضح إن القماش متراعي — ملمسه مختلف فعلًا.', txtEn:'You can feel the fabric care. Different texture from mall stuff.'},
  {name:'Dina M.', city:'Hurghada', rate:5, img:IMG.sew6, txt:'اقروا جدول المقاسات الأول — المقاس المقترح طلع بيرفكت.', txtEn:'Use the size chart first, the suggestion was spot on.'},
  {name:'Mahmoud T.', city:'Asyut', rate:5, img:IMG.pack, txt:'الجودة بالنسبة للسعر ممتازة، ودفعت عند الاستلام.', txtEn:'Great quality for the price and cash on delivery worked fine.'}
];
const FAQS = [
  {q:'إزاي أعرف مقاسي الصح؟', a:'كل منتج عليه جدول مقاسات بالسنتيمتر، وكمان أداة «اقترحلي مقاس» — جاوب سؤالين وهنقولك المقاس الأقرب.', qe:'How do I find my size?', ae:'Every product has a cm size chart plus a quick “suggest my size” tool — answer 2 questions and we recommend.'},
  {q:'الشحن بياخد قد إيه وبتكلفته كام؟', a:'القاهرة والجيزة: 24–48 ساعة بـ 60 ج.م. باقي المحافظات 2–4 أيام بـ 90 ج.م. وفوق 1500 ج.م الشحن مجاني.', qe:'How long does shipping take?', ae:'Cairo/Giza 24–48h (EGP 60), other governorates 2–4 days (EGP 90). Free over EGP 1,500.'},
  {q:'في استبدال أو استرجاع؟', a:'أيوه — 14 يوم من الاستلام، الاستبدال مجاني (مقاس أو لون) والمندوب بييجي لباب البيت.', qe:'Can I exchange or return?', ae:'Yes — 14 days from delivery. Exchanges are free (size or color), courier comes to your door.'},
  {q:'الدفع عند الاستلام متاح؟', a:'متاح في كل مصر، وكمان فوري وInstaPay وبطاقات Visa/Mastercard/Meeza وتقسيط ValU.', qe:'Is cash on delivery available?', ae:'Nationwide. Plus Fawry, InstaPay, Visa/Mastercard/Meeza and ValU installments.'},
  {q:'التغليف عامل إزاي؟', a:'كل قطعة في كيس قماش من بقايا الأتيليه وعلبة كرافت. الهدايا بيترافق معاها كارت بخط اليد مجانًا.', qe:'How is the packaging?', ae:'Each piece comes in a fabric bag made from atelier offcuts inside a kraft box. Free hand-written gift card on request.'},
  {q:'بتوصلوا بره مصر؟', a:'للسعودية والإمارات بنشحن أسبوعيًا (5–7 أيام عمل) والأسعار بتتحسب بالعملة المحلية.', qe:'Do you ship outside Egypt?', ae:'Weekly to KSA & UAE (5–7 business days), prices convert to your currency from the switcher.'}
];
const POSTS = [
  {id:'linen-care', tag:'العناية', tagEn:'Care', title:'إزاي تغسل الكتان صح (من غير ما يبوظ)', titleEn:'How to wash linen right', img:IMG.sew4, mins:4,
   ex:'الكتان بيعيش 10 سنين لو اتعامل صح — دليل الغسيل والنشفة والكي.', exEn:'Linen can live 10 years if treated right — washing, drying and ironing guide.',
   body:['الكتان من أقوى الألياف الطبيعية، بس نقطة ضعفه المعاملة الخشنة في الغسيل. القاعدة: مياه باردة ودوران بطيء.','النشفة في الضل مش في الشمس المباشرة — الشمس بتكسّر الألياف مع الوقت. والكي أسهل وهو لسه ندّي.','التجعيد الخفيف جزء من شخصية الكتان. سيبه يجف وهو مصفوح بإيدك وهو مبلول وهيطلع جميل.'],
   bodyEn:['Linen is one of the strongest natural fibres but hates harsh washing. Rule: cold water, slow spin.','Dry in shade, never direct sun — sun weakens fibres over time. Iron while damp for the easiest glide.','Slight wrinkling is part of linen’s character. Let it dry smoothed by hand and it will look intentional.']},
  {id:'capsule-summer', tag:'تنسيق', tagEn:'Styling', title:'كابسولة الصيف: 10 قطع تكفوك شهر كامل', titleEn:'Summer capsule: 10 pieces, a whole month', img:IMG.edit, mins:6,
   ex:'2 قميص، بنطلون، فستان، بليزر خفيف وتيشيرتين = 30 لوك.', exEn:'2 shirts, wide pants, a dress, a light blazer and 2 tees = 30 looks.',
   body:['فكرة الكابسولة: اشتري أقل والبس أكتر. اخترنا 10 قطع بألوان بتتنسق: عاجي، فحمي، زيتوني، وطيني.','القاعدة: كل قطعة تتلبس مع 3 تانية على الأقل. قميص الكتان المفتوح فوق التيشيرت هو أسرع ابجريد.','الابجريد الحقيقي مش في الكمية — في الخامة.'],
   bodyEn:['The capsule idea: buy less, wear more. We picked 10 pieces in stackable colors: ivory, coal, olive and clay.','Rule: each piece must work with at least 3 others. An open linen shirt over a tee is the fastest upgrade.','The real upgrade is not quantity — it is fabric.']},
  {id:'atelier-day', tag:'وراء الكواليس', tagEn:'Backstage', title:'يوم في أتيليه روح: من الرسم للقصّة الأخيرة', titleEn:'A day at the RŪH atelier', img:IMG.shoot, mins:5,
   ex:'صورة بتوصلك في أسبوع، بس وراها 3 شهور شغل.', exEn:'A photo reaches you in a week, but behind it are 3 months of work.',
   body:['اليوم بيبدأ الساعة 9 بقهوة وطاولة القماش. كل باترون بيتجهز على مانيكان حقيقي.','أهم لحظة هي «البروفة»: القطعة بتتلبس على 4 أجسام مختلفة قبل القص النهائي.','آخر اليوم للفرش والتغليف في كيس القماش — 6 إيدين على الأقل لمست كل قطعة.'],
   bodyEn:['The day starts at 9 with coffee and the fabric table. Every pattern is fitted on a real mannequin.','The key moment is the fitting: each sample is worn by 4 different body shapes before cutting the batch.','The day ends with pressing and packing into the fabric bag — at least 6 hands touch every piece.']}
];
const UGC = [
  {img:IMG.hBook, h:'@nada.wears'},{img:IMG.hOut, h:'@mariam.style'},{img:IMG.hCoat, h:'@sally_incairo'},
  {img:IMG.khakiJ, h:'@omar.png'},{img:IMG.wWhite, h:'@farah.looks'},{img:IMG.hWalk, h:'@heba_modesty'}
];
const PROOFS = [
  {n:'Sara from Maadi', nAr:'سارة من المعادي', t:'just bought the Linen Dress', tAr:'اشترت فستان الكتان الرملي', ago:'2h ago', agoAr:'قبل ساعتين', img:IMG.hDoor},
  {n:'Ahmed from Nasr City', nAr:'أحمد من مدينة نصر', t:'just bought the Linen Shirt', tAr:'اشترى قميص الكتان العاجي', ago:'40m ago', agoAr:'قبل 40 دقيقة', img:IMG.shHang},
  {n:'Mariam from Alexandria', nAr:'مريم من الإسكندرية', t:'just bought the Knit Pullover', tAr:'اشترت البلوفر التريكو', ago:'3h ago', agoAr:'قبل 3 ساعات', img:IMG.knit2}
];
const PAGES = {
  shipping:{t:'الشحن والتوصيل', te:'Shipping & Delivery', p:'بنجهّز الطلبات من السبت للخميس، ورسالة واتساب برقم تتبع حي بتوصلك أول ما الأوردر يتحرك.', pe:'Orders are prepared Sat–Thu, and a WhatsApp message with a live tracking number reaches you as soon as the order moves.',
    h:[['القاهرة والجيزة','24–48 ساعة · 60 ج.م — مجاني فوق 1500 ج.م'],['باقي المحافظات','2–4 أيام عمل · 90 ج.م — مجاني فوق 1500 ج.م'],['الاستلام من الفرع','وسط البلد، شارع قصر النيل 14 — مجانًا خلال 24 ساعة'],['الخليج','5–7 أيام عمل · شحن موحد 350 ج.م أو ما يعادلها']]},
  returns:{t:'الاستبدال والاسترجاع', te:'Exchanges & Returns', p:'14 يوم من الاستلام. المندوب بييجي لباب البيت، والفلوس بترجع على نفس وسيلة الدفع في 5–7 أيام.', pe:'14 days from delivery. Courier pickup from your door; refunds go back to the same payment method in 5–7 days.',
    h:[['الاستبدال','مجاني تمامًا — مقاس أو لون'],['الاسترجاع','فلوسك كاملة بشرط التاج سليم والقطعة متتلابسش'],['الاستثناء الوحيد','الجوارب لأسباب صحية (لكن أي عيب مصنع = استبدال فوري)']]},
  privacy:{t:'سياسة الخصوصية', te:'Privacy Policy', p:'بنجمع اسمك ورقمك وعنوانك للشحن بس. بيانات الدفع بتتم على بوابات معتمدة ومش بتوصلنا.', pe:'We only collect what shipping needs. Payments run on certified gateways; we never see your card.',
    h:[['البيانات الشخصية','مش بنشاركها مع أي حد غير شركة الشحن'],['الكوكيز','localStorage على جهازك للسلة والمفضلة بس'],['حق النسيان','اطلب مسح بياناتك في أي وقت على واتساب']]},
  terms:{t:'الشروط والأحكام', te:'Terms & Conditions', p:'الأسعار شاملة الضريبة. المخزون المعروض لحظي، والكوبون بيتطبق مرة واحدة لكل عميل.', pe:'Prices include tax. Stock shown is live. Coupons apply once per customer.',
    h:[['الألوان','ممكن تتفاوت شوية حسب الشاشة — وعندك 14 يوم استرجاع'],['العروض','ادمج الكوبون مع الحزمة؟ الخصم الأعلى بيتطبق تلقائيًا'],['الملكية','كل التصميمات أصلية من أتيليه روح']]}
};
const TRENDING = ['لينن linen','قميص shirt','فستان dress','بلوفر knit','بليزر blazer','وشاح scarf'];

/* ترجمات لوحة الأدمن (مفصولة عن I18N الرئيسي عشان يفضل منظّم) */
const ADMIN_I18N = {
 ar:{
  title:'لوحة الأدمن', sub:'متابعة المتجر كله من مكان واحد — وأي منتج تضيفه يظهر في المتجر فورًا.',
  openStore:'افتح المتجر', logout:'خروج', pinH:'لوحة الأدمن', pinHint:'ديمو: الـ PIN هو', pinLb:'PIN', enter:'دخول', back:'رجوع للمتجر', pinBad:'الـ PIN مش مظبوط',
  catalog:'منتج في الكاتالوج', stockUnits:'إجمالي القطع في المخزون', ordersN:'طلبات على الجهاز ده', rev:'إجمالي المبيعات (ديمو)',
  wishN:'في المفضلة', adminN:'منتجات ضفتها من هنا', low:'مخزون قليل — جدد قبل ما يخلص',
  newP:'ضيف منتج جديد', editP:n=>'تعديل منتج #' + n, cancel:'إلغاء', saveNew:'ضيف المنتج للمتجر', saveEdit:'احفظ التعديل',
  s1:'١ — الأسماء والقسم', s2:'٢ — التسعير والخامة', s3:'٣ — الصور', s4:'٤ — المميزات والألوان', s5:'٥ — المخزون لكل مقاس', s6:'٦ — الوصف والعناية',
  nameAr:'الاسم بالعربي', nameEn:'الاسم بالإنجليزي', cat:'القسم', sub:'التصنيف الفرعي', price:'السعر (ج.م)', old:'سعر قبل الخصم (اختياري)',
  fabricAr:'الخامة', fabricEn:'Fabric (EN)', img1:'رابط الصورة الأساسية *', img2:'صورة الهوفر (اختياري)', badge:'البادج', fit:'ملاحظة المقاس',
  badgeNone:'بدون', badgeNew:'جديد — New', badgeSale:'عرض/خصم', fitN:'عادي', fitS:'صغير — خد أكبر', fitL:'واسع — خد أصغر',
  colors:'الألوان (اختار من سواتش الستايل)', stockLb:'المخزون لكل مقاس (صفر = يختفي)', descAr:'الوصف (عربي)', descEn:'Description (EN)', careAr:'تعليمات العناية',
  preview:'معاينة', missing:n=>'ناقص: ' + n, saved:'اتحفظ — هيظهر في المتجر فورًا', savedLink:'شوفه هنا: الكولكشن', del:'امسح', confirmDel:'متأكد؟ امسح', no:'لا',
  baseTag:'أساسي', admTag:'أدمن', prot:'المنتجات «الأساسية» الـ 24 بتتعدّل وتظهر فورًا، بس المسح متاح للي ضفته من اللوحة بس.',
  prodsT:n=>'المنتجات (' + n + ')', hProd:'الاسم', hPrice:'السعر', hStock:'مخزون', hBadge:'بادج', hAct:'إجراءات',
  ordersT:n=>'الطلبات (' + n + ')', oNum:'رقم', oDate:'التاريخ', oTotal:'الإجمالي', oShip:'الشحن', oPay:'الدفع', oItems:'قطع',
  noOrders:'لسه مفيش طلبات — اعمل طلب تجريبي من المتجر وهيظهر هنا.', colP:'منتج', colS:'قطعة',
  delTo:'اتمسح من المتجر', req:'اسم عربي • سعر • صورة • لون • مقاس • مخزون', numPh:'1490', urlPh:'https://…', subPh:'قمصان',
  prdNamePh:'قميص كتان – عاجي', prdNameEnPh:'Linen Shirt – Ivory', fabricPh:'كتان 100%', fabricEnPh:'100% linen', dash:'—'
 },
 en:{
  title:'Admin dashboard', sub:'One place to watch everything — anything you add appears in the store instantly.',
  openStore:'Open store', logout:'Sign out', pinH:'Admin dashboard', pinHint:'Demo PIN:', pinLb:'PIN', enter:'Enter', back:'← Back to store', pinBad:'Wrong PIN',
  catalog:'products in catalog', stockUnits:'units in stock', ordersN:'orders on this device', rev:'total revenue (demo)',
  wishN:'in wishlist', adminN:'added from here', low:'Low stock — restock soon',
  newP:'Add new product', editP:n=>'Edit product #' + n, cancel:'Cancel', saveNew:'Add to store', saveEdit:'Save changes',
  s1:'1 — Names & category', s2:'2 — Pricing & fabric', s3:'3 — Images', s4:'4 — Options & colors', s5:'5 — Stock per size', s6:'6 — Description & care',
  nameAr:'Name (Arabic)', nameEn:'Name (English)', cat:'Category', sub:'Sub-category', price:'Price (EGP)', old:'Old price (optional)',
  fabricAr:'Fabric', fabricEn:'Fabric (EN)', img1:'Main image URL *', img2:'Hover image (optional)', badge:'Badge', fit:'Fit note',
  badgeNone:'None', badgeNew:'New', badgeSale:'Sale', fitN:'Regular', fitS:'Runs small', fitL:'Runs large',
  colors:'Colors (from the design system)', stockLb:'Stock per size (0 = hidden)', descAr:'Description (AR)', descEn:'Description (EN)', careAr:'Care instructions',
  preview:'Preview', missing:n=>'Missing: ' + n, saved:'Saved — it is live in the store now', savedLink:'See it: Collection', del:'Delete', confirmDel:'Sure? Delete', no:'No',
  baseTag:'Base', admTag:'Admin', prot:'The base 24 can be edited and are live instantly; deletion is only allowed on items you add here.',
  prodsT:n=>'Products (' + n + ')', hProd:'Product', hPrice:'Price', hStock:'Stock', hBadge:'Badge', hAct:'Actions',
  ordersT:n=>'Orders (' + n + ')', oNum:'No.', oDate:'Date', oTotal:'Total', oShip:'Shipping', oPay:'Payment', oItems:'Items',
  noOrders:'No orders yet — run a demo checkout and it shows up here.', colP:'products', colS:'items',
  delTo:'Removed from the store', req:'Arabic name • price • image • color • size • stock', numPh:'1490', urlPh:'https://…', subPh:'Shirts',
  prdNamePh:'Wide Linen Shirt – Ivory', prdNameEnPh:'Wide Linen Shirt – Ivory', fabricPh:'100% linen', fabricEnPh:'100% linen', dash:'—'
 }};

/* الترجمات */
const I18N = {
 ar:{ shop:'تسوق', sale:'عليه عرض', blog:'المدونة',
   heroKick:'كولكشن الصيف — مصنوع في القاهرة', heroH:'لبس بيشبهك', heroSub:'قطع من الكتان والقطن، مصممة في القاهرة، تعيش معاك أكتر من موسم.',
   ctaCollection:'اتفرج على الكولكشن', ctaStory:'اعرف قصتنا', heroProof1:'من 1,240 تقييم', heroProof2:'توصيل 48 ساعة', heroProof3:'استبدال مجاني',
   trust1:'توصيل مجاني', trust1s:'للطلبات فوق 1500 ج.م', trust2:'استبدال 14 يوم', trust2s:'من غير أسئلة، من باب البيت', trust3:'دفع عند الاستلام', trust3s:'وفوري وInstaPay كمان', trust4:'دعم واتساب', trust4s:'من 10ص لـ 10م كل يوم',
   catsT:'اتسوق حسب القسم', catsS:'أربع مجموعات، نفس الفلسفة: خامات طبيعية وقصّات بتعيش.',
   pc:'قطعة', newT:'وصل حديثًا', bestT:'الأكثر مبيعًا', saleT:'عليه عرض', newS:'أجدد القطع نزلت الأتيليه من أسبوعين.', bestS:'القطع اللي الناس بترجع تطلبها تاني.', saleS:'خصم حقيقي على الموسم اللي فات.', allLink:'شوف الكل',
   quickView:'عرض سريع', quickAdd:'إضافة سريعة', addCart:'ضيف للسلة', addedOk:'ضفناه للسلة', pickSize:'اختار مقاسك:',
   editK:'لوك بوك الصيف', editH:'كولكشن «رمل وبحر»', editP:'لوك بوك اتصوّر مع صديقات في وقت الغروب — 14 لوك كاملين من الكتان والقطن.', editCta:'تسوّقي الكولكشن',
   bundleT:'كمّل اللوك', bundleS:'الثلاث قطع دول اتصمموا يتلبسوا مع بعض — ولما تاخدهم حزمة بيتحسبلك خصم 15% تلقائي.', bundleBtn:'ضيف الحزمة (خصم 15%)', bundleOk:'ضفنا الحزمة للسلة بخصم 15%',
   offerT:'عرض نهاية الأسبوع', offerH:'خصم 15% على كل حاجة', offerP:'استخدم كود ROOH10 عند الدفع — العرض ينتهي في:', offerCta:'تسوّق العرض', d:'يوم', h:'ساعة', m:'دقيقة', s:'ثانية', offerEnd:'انتهى العرض — شكرًا إنك كنت معانا',
   storyK:'ليه روح؟', storyH:'مش بنعمل هدوم — بنعمل قطع بتكبر معاك', sp1:'خامات بتتقفل فيها', sp1s:'كتان أوروبي وقطن بيما مصري — خامات بنختارها بإيدنا قبل القص.', sp2:'مقاسات حقيقية', sp2s:'بنقيس على أجسام مصرية — علشان كده 94% بيقولوا «مقاس مظبوط».', sp3:'صناعة محلية', sp3s:'كل قطعة بتتعمل في أتيليه وسط البلد وبإمضاء الأسطى.', storyCta:'اقرأ القصة كاملة',
   revsT:'كلامهم عنّا', revsS:'تقييمات موثقة من مشتريات حقيقية.', of5:'من 5', basedOn:'بناءً على 1,240 تقييم', fitRight:'مقاس مظبوط',
   ugcT:'روح عليكم', ugcS:'تاج @ruh.cairo ولبسك ممكن يطلع هنا.',
   faqT:'أسئلة بتتسأل كتير',
   newsK:'انضم لعيلة روح', newsH:'خصم 10% على أول طلب', newsP:'سيب إيميلك وهيوصلك الكود ROOH10 فورًا.', newsPh:'إيميلك', newsBtn:'ابعتلي الخصم', newsInv:'الإيميل ده ناقص حاجة — اتأكد وجرّب تاني', newsOkH:'تمام! الكود وصل', newsOkP:'استخدمه عند الدفع:', newsOkB:'بعتناه على إيميلك كمان عشان متنساهوش.', newsGood:'شكله تمام',
   searchPh:'دوّر على قميص، فستان، خامة…', sTr:'بحث تريند', sRec:'دوّرت قبل كده', sClr:'مسح', sNoR:'مفيش نتائج لـ', sNoRp:'جرّب كلمة أبسط أو اتفرج على الأقسام:', sAll:'كل النتائج',
   cartT:'سلة التسوق', cartEmptyH:'سلتك فاضية لسه', cartEmptyP:'مالها — الكولكشن مليانة قطع مستنية.', cartEmptyC:'ابدأ التسوق', freeShipOk:'ياهو! التوصيل مجاني', freeShipNote2:'و التوصيل يبقى مجاني', subtotal:'المجموع', bundleDisc:'خصم الحزمة 15%', couponDisc:'خصم الكوبون', total:'الإجمالي', shipNote:'الشحن بيتحسب في الخطوة الجاية', couponPh:'كود الخصم (جرّب ROOH10)', applyBtn:'طبّق', cpnOk:'الكوبون اتطبّق — خصم 10%', cpnBad:'الكود ده مش شغال، اتأكد وجرّب تاني', checkoutBtn:'كمّل للدفع', contShop:'كمّل تسوق', wishAdd:'ضفناها للمفضلة', wishRm:'شلناها من المفضلة', rmItem:'شلناه من السلة', qty:'الكمية',
   results:'قطعة', filters:'الفلاتر', clearAll:'مسح الكل', sort:'الترتيب', sNew:'الأحدث', sBest:'الأكثر مبيعًا', sRate:'الأعلى تقييمًا', sLow:'السعر: من الأقل', sHigh:'السعر: من الأعلى', fCat:'القسم', fSize:'المقاس', fColor:'اللون', fPrice:'السعر', fFabric:'الخامة', fAv:'المتوفر بس', fRt:'التقييم', andUp:'وأعلى', noResH:'مفيش حاجة مطابقة', noResP:'وسّع الفلاتر شوية أو امسحهم.', colSub:'كل القطع باستبدال مجاني خلال 14 يوم.', colSale:'خصومات حقيقية على مخزون الموسم اللي فات.',
   szGuide:'دليل المقاسات', szSuggest:'اقترحلي مقاس', fitSmall:'المقاس ده بيجي صغير شوية — خد أكبر من المعتاد', fitLarge:'القصّة واسعة — لو بتحب المظبوط خد أصغر', last:'آخر', piecesIn:'قطعة في مقاس', inStock:'متوفر وجاهز للشحن', descT:'الوصف', careT:'العناية بالقطعة', shipRT:'الشحن والاستبدال', shipRTP:'توصيل 24–48 ساعة في القاهرة، و2–4 أيام للمحافظات. استبدال مجاني خلال 14 يوم من باب البيت.',
   revsPDP:'تقييمات المنتج', withPics:'بصور بس', helpful:'التقييم ده كان مفيد؟', yes:'أيوه', no:'لأ', thanks:'شكرًا على رأيك!', relT:'ممكن يعجبك كمان', recentT:'شفته مؤخرًا', bundlePdpT:'كمّل اللوك معاه',
   wlT:'مفضلتي', wlEmptyH:'مفيش هنا حاجة', wlEmptyP:'القطع اللي هتدوس على القلب فيها هتتجمع هنا.',
   cmpT:'المقارنة', cmpAdd:'ضفناه للمقارنة', cmpFull:'المقارنة واخدة 3 منتجات بس', cmpCta:'قارن', cmpRm:'شلناه من المقارنة', cmpPrice:'السعر', cmpRate:'التقييم', cmpFab:'الخامة', cmpSz:'المقاسات المتاحة', cmpClr:'الألوان', cmpEmpty:'ضيف منتجات من زرار الميزان على الكارت',
   selSizePlz:'اختار المقاس الأول', outOf:'ده خلص خلاص في المقاس ده', sizeOne:'مقاس واحد', closeTxt:'إغلاق', backTxt:'رجوع', homeTxt:'الرئيسية', menuTxt:'القائمة',
   ckoT:'إتمام الطلب', st1:'بياناتك', st2:'الشحن', st3:'الدفع', back:'ارجع', next:'كمّل', nm:'الاسم بالكامل', ph:'موبايلك', em:'الإيميل (اختياري)', city:'المحافظة', addr:'العنوان بالتفصيل', notes:'ملاحظات للتوصيل (اختياري)', saveAddr:'احفظ البيانات دي للطلب الجاي', guestNote:'طلب ضيف — مش محتاج حساب',
   shipM:'اختار طريقة الشحن', shp1:'توصيل للبيت — قاهرة/جيزة', shp1s:'24–48 ساعة', shp2:'توصيل للبيت — المحافظات', shp2s:'2–4 أيام عمل', shp3:'استلام من الفرع', shp3s:'وسط البلد — شارع قصر النيل 14', freeTxt:'مجاني', freeOver:'طلبك فوق 1500 — التوصيل علينا',
   payM:'اختار طريقة الدفع', pay1:'كاش عند الاستلام', pay1s:'ادفع لما توصلك القطع', pay2:'بطاقة (Visa / Mastercard / Meeza)', pay2s:'دفع آمن ومشفر', pay3:'فوري', pay3s:'هنبعتلك كود دفع بعد التأكيد', pay4:'ValU — تقسيط', pay4s:'للطلبات فوق 1000 ج.م', pay5:'InstaPay', pay5s:'تحويل فوري', pay6:'Apple Pay', pay6s:'دفع بلمسة واحدة',
   cardNo:'رقم البطاقة', cardEx:'MM/YY', cardCv:'CVV', valuT:'مدة التقسيط', mo:'شهر', placeOrder:'أكد الطلب', ckoSum:'ملخص الطلب', ship:'الشحن',
   invPh:'رقم الموبايل ده ناقص — لازم 01 والـ 9 أرقام اللي بعدها', invNm:'اكتب اسمك الأول على الأقل', invAddr:'العنوان محتاج تفاصيل أكتر (شارع/رقم/علامة)', invEm:'الإيميل مش مظبوط', ckP:'راجع الحقول اللي فوق — في حاجات ناقصة',
   ordH:'طلبك اتسجل!', ordP:'هنكلمك للتأكيد وبعدها الطلب بينزل التجهيز. رقم الطلب:', ordTrack:'تتبع الطلب', ordCont:'كمّل تسوق', tl1:'اتستلم الطلب', tl2:'قيد التجهيز', tl3:'اتشحن', tl4:'اتسلّم', trackT:'تتبع الطلب', payVia:'الدفع:', shipVia:'الشحن:',
   copyOk:'اتنسخ الرابط', langBtn:'العربية', waTxt:'أهلًا! أنا ببص على المتجر وعندي سؤال', waTxtP:'أهلًا! عندي سؤال عن:', cookieTxt:'بنستخدم كوكيز محلية عشان نفتكر سلتك وتفضيلاتك. مفيش تتبع إعلاني — برايفسي أولًا.', cookieOk:'تمام، فهمت', cookieP:'سياسة الخصوصية',
   annTxt1:'توصيل', annTxt1b:'مجاني', annTxt2:'فوق 1500 ج.م · استبدال خلال 14 يوم · دفع عند الاستلام',
   footerTag:'كتان وقطن مصمَّم في القاهرة، بقصّات حقيقية وخامات بتعيش.', helpT:'مساعدة', contactT:'تواصل معانا', shopT:'تسوق', madeIn:'صُنع بحب في القاهرة', policiesT:'سياسات', allRights:'كل الحقوق محفوظة',
   authLogin:'تسجيل الدخول', authSignup:'حساب جديد', pass:'كلمة السر', pass2:'أكّد كلمة السر', forH:'نسيت كلمة السر؟', forP:'اكتب إيميلك وهنجهزلك كود استرجاع', authEP:'سجّل دخولك بالإيميل وكلمة السر', authSP:'دقيقتين وحسابك جاهز — خصومات وتتبّع طلبات',
   sendCode:'ابعتلي الكود', codePh:'كود الاسترجاع (٤ أرقام)', newPass:'كلمة السر الجديدة', resetBtn:'غيّر كلمة السر', loginBtn:'دخول', signupBtn:'إنشاء حساب', termsAcc:'أوافق على', termsL:'الشروط والخصوصية',
   passWeak:'ضعيفة — زوّد أرقام ورموز', passMid:'وسط — مقبولة', passStrong:'قوية', acctEm:'الإيميل', acctNm:'الاسم',
   eDup:'الإيميل ده مسجل قبل كده — سجّل دخولك', eNo:'الإيميل ده مش مسجل عندنا — اعمل حساب جديد', ePass:'كلمة السر مش مظبوطة', ePass2:'كلمتا السر مش متطابقتين', ePassLen:'كلمة السر لازم 8 أحرف على الأقل', eCode:'الكود مش صح — اتأكد وجرّب تاني', eTerm:'لازم توافق على الشروط الأول',
   demoCode:'ديمو من غير سيرفر — الكود بتاعك هو:', codeSent:'جهزنا كود الاسترجاع', resetOk:'اتغيّرت! سجّل دخولك بالجديدة', loginOk:'أهلًا بيك', signupOk:'حسابك اتعمل', outOk:'سجّلنا خروجك — نورتنا',
   acctPage:'حسابي', profile:'بياناتي', saveBtn:'احفظ التعديلات', savedOk:'اتحفظت', ordersT:'طلباتي', noOrders:'لسه مفيش طلبات على الجهاز ده', savedAddr:'العنوان المحفوظ', noAddr:'مفيش عنوان محفوظ — فعّل خيار «احفظ» أثناء الدفع', memberSince:'عضو من', changePass:'غيّر كلمة السر', curPass:'كلمة السر الحالية', eCur:'كلمة السر الحالية مش مظبوطة', passOk:'كلمة السر اتغيّرت بنجاح', acctOut:'تسجيل الخروج',
   authH:'حساب واحد — كل حاجة أسرع', authB1:'طلباتك كلها متتبعة من مكان واحد', authB2:'عنوانك محفوظ — الدفع في أقل من دقيقة', authB3:'العروض الخاصة بتوصل للأعضاء الأول', authB4:'مفضلتك وسلتك محفوظين على جهازك', showP:'إظهار كلمة السر', hideP:'إخفاء كلمة السر',
   qvFull:'الصفحة الكاملة بالتفاصيل والتقييمات', occurred:'سوزة عند الدفع', costlyM:'من 10ص لـ 10م',
   pg404:'الصفحة دي مش موجودة', pg404p:'اللينك اتغيّر أو الصفحة اتنقلت.', pg404b:'ارجع للرئيسية', readRev:'اقرأ التقييمات', all:'الكل' },
 en:{ shop:'Shop', sale:'On Sale', blog:'Journal',
   heroKick:'Summer drop — made in Cairo', heroH:'Clothes that feel like you', heroSub:'Linen and cotton pieces, designed in Cairo, made to outlive seasons.',
   ctaCollection:'Shop the collection', ctaStory:'Our story', heroProof1:'from 1,240 reviews', heroProof2:'48h delivery', heroProof3:'Free exchanges',
   trust1:'Free shipping', trust1s:'On orders over EGP 1,500', trust2:'14-day exchanges', trust2s:'No questions, from your door', trust3:'Cash on delivery', trust3s:'Plus Fawry & InstaPay', trust4:'WhatsApp support', trust4s:'10am–10pm, every day',
   catsT:'Shop by category', catsS:'Four collections, one philosophy: natural fabrics, lasting cuts.',
   pc:'items', newT:'New arrivals', bestT:'Best sellers', saleT:'On sale', newS:'Fresh from the atelier in the last two weeks.', bestS:'Pieces people come back for.', saleS:'Real discounts on last-season stock.', allLink:'View all',
   quickView:'Quick view', quickAdd:'Quick add', addCart:'Add to cart', addedOk:'Added to cart', pickSize:'Pick your size:',
   editK:'Summer lookbook', editH:'The “Sand & Sea” edit', editP:'A lookbook shot with friends at golden hour — 14 full looks in linen and cotton.', editCta:'Shop the edit',
   bundleT:'Complete the look', bundleS:'These three pieces were designed together — take them as a set and 15% comes off automatically.', bundleBtn:'Add the bundle (−15%)', bundleOk:'Bundle added with 15% off',
   offerT:'Weekend offer', offerH:'15% off everything', offerP:'Use code ROOH10 at checkout — ends in:', offerCta:'Shop the offer', d:'days', h:'hrs', m:'min', s:'sec', offerEnd:'Offer ended — thanks for being here',
   storyK:'Why RŪH?', storyH:'We don’t make clothes — we make pieces that grow with you', sp1:'Fabrics you can trust', sp1s:'European linen and Egyptian Pima cotton — hand-picked before every cut.', sp2:'Real sizing', sp2s:'Measured on Egyptian bodies — that’s why 94% say “fits true”.', sp3:'Made locally', sp3s:'Every piece is sewn in our Downtown Cairo atelier and signed by its tailor.', storyCta:'Read the full story',
   revsT:'In their words', revsS:'Verified reviews from real orders.', of5:'out of 5', basedOn:'Based on 1,240 reviews', fitRight:'True to size',
   ugcT:'RŪH on you', ugcS:'Tag @ruh.cairo for a chance to be featured.',
   faqT:'Frequently asked',
   newsK:'Join the family', newsH:'10% off your first order', newsP:'Leave your email and we’ll send code ROOH10 right away.', newsPh:'Your email', newsBtn:'Send my discount', newsInv:'That email looks off — check it and try again', newsOkH:'Done! Code sent', newsOkP:'Use it at checkout:', newsOkB:'We also emailed it to you, just in case.', newsGood:'Looks good',
   searchPh:'Search shirts, dresses, fabrics…', sTr:'Trending searches', sRec:'Recent searches', sClr:'Clear', sNoR:'No results for', sNoRp:'Try a simpler word, or browse:', sAll:'View all results',
   cartT:'Your cart', cartEmptyH:'Your cart is empty', cartEmptyP:'The collection is full of pieces waiting.', cartEmptyC:'Start shopping', freeShipOk:'Nice! Shipping is free', freeShipNote2:'away from free shipping', subtotal:'Subtotal', bundleDisc:'Bundle −15%', couponDisc:'Coupon', total:'Total', shipNote:'Shipping calculated at checkout', couponPh:'Discount code (try ROOH10)', applyBtn:'Apply', cpnOk:'Coupon applied — 10% off', cpnBad:'That code doesn’t work, double-check it', checkoutBtn:'Checkout', contShop:'Keep shopping', wishAdd:'Saved to wishlist', wishRm:'Removed from wishlist', rmItem:'Removed from cart', qty:'Qty',
   results:'items', filters:'Filters', clearAll:'Clear all', sort:'Sort', sNew:'Newest', sBest:'Best selling', sRate:'Top rated', sLow:'Price: low to high', sHigh:'Price: high to low', fCat:'Category', fSize:'Size', fColor:'Color', fPrice:'Price', fFabric:'Fabric', fAv:'In stock only', fRt:'Rating', andUp:'& up', noResH:'Nothing matches', noResP:'Loosen the filters or clear them.', colSub:'Every piece has free 14-day exchanges.', colSale:'Real discounts on last-season stock.',
   szGuide:'Size guide', szSuggest:'Suggest my size', fitSmall:'Runs small — take one size up', fitLarge:'Relaxed cut — size down for a fitted look', last:'Only', piecesIn:'left in size', inStock:'In stock, ready to ship', descT:'Description', careT:'Care', shipRT:'Shipping & returns', shipRTP:'24–48h in Cairo/Giza, 2–4 days elsewhere. Free 14-day exchanges from your door.',
   revsPDP:'Product reviews', withPics:'With photos only', helpful:'Was this helpful?', yes:'Yes', no:'No', thanks:'Thanks for the feedback!', relT:'You may also like', recentT:'Recently viewed', bundlePdpT:'Complete it with',
   wlT:'Wishlist', wlEmptyH:'Nothing here yet', wlEmptyP:'Pieces you heart will gather here.',
   cmpT:'Compare', cmpAdd:'Added to compare', cmpFull:'Compare holds 3 products max', cmpCta:'Compare', cmpRm:'Removed from compare', cmpPrice:'Price', cmpRate:'Rating', cmpFab:'Fabric', cmpSz:'Available sizes', cmpClr:'Colors', cmpEmpty:'Add products via the compare icon on cards',
   selSizePlz:'Choose a size first', outOf:'Out of stock in that size', sizeOne:'One size', closeTxt:'Close', backTxt:'Back', homeTxt:'Home', menuTxt:'Menu',
   ckoT:'Checkout', st1:'Details', st2:'Shipping', st3:'Payment', back:'Back', next:'Continue', nm:'Full name', ph:'Mobile', em:'Email (optional)', city:'Governorate', addr:'Full address', notes:'Delivery notes (optional)', saveAddr:'Save this for next time', guestNote:'Guest checkout — no account needed',
   shipM:'Choose shipping', shp1:'Home delivery — Cairo/Giza', shp1s:'24–48 hours', shp2:'Home delivery — other governorates', shp2s:'2–4 business days', shp3:'Store pickup', shp3s:'Downtown — 14 Qasr El Nil St', freeTxt:'Free', freeOver:'Over 1,500 — shipping is on us',
   payM:'Choose payment', pay1:'Cash on delivery', pay1s:'Pay when it arrives', pay2:'Card (Visa / Mastercard / Meeza)', pay2s:'Secure, encrypted checkout', pay3:'Fawry', pay3s:'We send a payment code after confirmation', pay4:'ValU — installments', pay4s:'For orders over EGP 1,000', pay5:'InstaPay', pay5s:'Instant transfer', pay6:'Apple Pay', pay6s:'One-touch payment',
   cardNo:'Card number', cardEx:'MM/YY', cardCv:'CVV', valuT:'Installment period', mo:'months', placeOrder:'Confirm order', ckoSum:'Order summary', ship:'Shipping',
   invPh:'Mobile must look like 01xxxxxxxxx', invNm:'At least your first name, please', invAddr:'More detail please (street/number/landmark)', invEm:'That email isn’t right', ckP:'Check the highlighted fields — a few things are missing',
   ordH:'Order placed!', ordP:'We’ll call to confirm, then it moves to preparation. Order number:', ordTrack:'Track order', ordCont:'Keep shopping', tl1:'Order received', tl2:'Preparing', tl3:'Shipped', tl4:'Delivered', trackT:'Track order', payVia:'Payment:', shipVia:'Shipping:',
   copyOk:'Link copied', langBtn:'عربي', waTxt:'Hi! I’m browsing the store and have a question', waTxtP:'Hi! I have a question about:', cookieTxt:'We use local cookies to remember your cart and preferences. No ad tracking — privacy first.', cookieOk:'Got it', cookieP:'Privacy policy',
   annTxt1:'', annTxt1b:'Free', annTxt2:'shipping over EGP 1,500 · 14-day exchanges · Cash on delivery',
   footerTag:'Linen & cotton designed in Cairo. Real cuts, living fabrics.', helpT:'Help', contactT:'Contact us', shopT:'Shop', madeIn:'Made with love in Cairo', policiesT:'Policies', allRights:'All rights reserved',
   authLogin:'Sign in', authSignup:'Create account', pass:'Password', pass2:'Confirm password', forH:'Forgot password?', forP:'Enter your email and we’ll prepare a reset code', authEP:'Sign in with email & password', authSP:'Two minutes and your account is ready — offers & order tracking',
   sendCode:'Send my code', codePh:'Reset code (4 digits)', newPass:'New password', resetBtn:'Change password', loginBtn:'Sign in', signupBtn:'Create account', termsAcc:'I agree to the', termsL:'terms & privacy',
   passWeak:'Weak — add digits & symbols', passMid:'Medium — acceptable', passStrong:'Strong', acctEm:'Email', acctNm:'Name',
   eDup:'This email is registered — sign in instead', eNo:'This email isn’t registered — create an account', ePass:'Wrong password', ePass2:'Passwords don’t match', ePassLen:'Password needs at least 8 characters', eCode:'Wrong code — check & retry', eTerm:'Please accept the terms first',
   demoCode:'Serverless demo — your code is:', codeSent:'Reset code ready', resetOk:'Changed! Sign in with the new one', loginOk:'Welcome back', signupOk:'Account created', outOk:'Signed out — see you',
   acctPage:'My account', profile:'My details', saveBtn:'Save changes', savedOk:'Saved', ordersT:'My orders', noOrders:'No orders on this device yet', savedAddr:'Saved address', noAddr:'No saved address — enable “save” at checkout', memberSince:'Member since', changePass:'Change password', curPass:'Current password', eCur:'Current password is wrong', passOk:'Password updated', acctOut:'Sign out',
   authH:'One account — everything faster', authB1:'Track every order from one place', authB2:'Saved address — checkout in under a minute', authB3:'Members get offers first', authB4:'Wishlist & cart stay on your device', showP:'Show password', hideP:'Hide password',
   qvFull:'Full page with details & reviews', occurred:'', costlyM:'10am–10pm',
   pg404:'Page not found', pg404p:'The link changed or the page moved.', pg404b:'Back home', readRev:'Read reviews', all:'All' }
};
