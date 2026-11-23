// Тексты сайта на трёх языках. Узбекский и английский стоит проверить носителям.
window.I18N = {
ru: {
  nav_coll:'Коллекция', coll_title:'Коллекция Norm', coll_sub:'Наши вещи: футболки, поло, худи, кепки, шорты и штаны. Понравилось — собери своё в конструкторе.', nav_build:'Конструктор', nav_gallery:'Дизайны', hero_title:'Норма — это скучно.',
  hero_lead:'Почти все стоят в середине колокола. Узнай, где стоишь ты, и собери футболку, которой нет ни у кого. Принт или вышивка, твой рисунок или текст, под заказ.',
  curve_alt:'Кривая нормального распределения: большинство точек в центре, твоя точка красная', you:'ты', norm:'норма',
  q_step:'Вопрос {n} из {m}', result_label:'Твой результат', apply:'Собрать такую', again:'Пройти заново',
  quiz:[
    {q:'Идёшь по улице. Как на тебя смотрят?',a:['Никак','Иногда оборачиваются','Фотографируют']},
    {q:'Что открываешь первым утром?',a:['Переписку','Ленту','Свою страницу']},
    {q:'Футболка для тебя это…',a:['Просто удобно','Часть образа','Заявление']}],
  res:[
    {t:'Тихая норма',p:'Ты не кричишь, но замечаешь детали. Тебе подойдёт вышивка на груди: заметна вблизи.',text:'Norm'},
    {t:'Громкая норма',p:'Ты любишь, когда вещь говорит за тебя. Светлая футболка и крупный принт с твоим словом.',text:'Ты норма'},
    {t:'Вне нормы',p:'Ты уже за краем колокола. Тёмная футболка и фраза на спине, пусть читают вслед.',text:'Not norm'}],
  gal_title:'Дизайны Azastorm', gal_sub:'Готовые авторские работы. Выбери дизайн, цвет футболки и размер, остальное сделаем под заказ.', from:'от', choose:'Выбрать',
  b_title:'Конструктор', b_sub:'Выбери заготовку и нанесение. Рисунок можно увеличить, уменьшить и подвинуть. Всё шьётся и наносится по предзаказу, в наличии у нас ничего нет.',
  color:'Цвет', kind:'Нанесение', kind_print:'Принт', kind_emb:'Вышивка', place:'Место', place_front:'Грудь', place_back:'Спина',
  art:'Рисунок', art_text:'Текст', art_photo:'Своё фото', art_ref:'По описанию',
  text_aria:'Текст на футболке', photo_aria:'Загрузить фото',
  photo_note:'Фото ложится на футболку как рисунок и уйдёт вместе с заказом. Для вышивки мы упростим картинку до нескольких цветов.',
  ref_desc:'Опишите идею: что нарисовано, какой стиль, какие цвета', ref_link:'Ссылка на референс (Pinterest, Instagram…)',
  ref_note:'Мы нарисуем макет по описанию и референсу и пришлём на утверждение до оплаты.',
  chosen:'Выбран дизайн:', other:'Выбрать другой', adjust:'Размер и положение', scale:'Размер', mx:'Влево / вправо', my:'Вверх / вниз', reset:'Сбросить',
  tee_size:'Размер футболки', price_na:'Цена уточняется', mock_art:'твой рисунок', mock_ref:'макет пришлём', currency:'сум', to_order:'Оформить предзаказ',
  o_title:'Предзаказ', o_sub:'Оставьте контакты, мы свяжемся, подтвердим макет, цену и срок.',
  name:'Имя', phone:'Телефон', city:'Город и адрес доставки', comment:'Комментарий', summary:'Ваш заказ', submit:'Отправить заказ', sending:'Отправляем…',
  need_size:'Выберите размер футболки в конструкторе.', need_contact:'Укажите имя и телефон.', err:'Не удалось отправить. Попробуйте ещё раз или напишите нам в Instagram.',
  ok_title:'Заказ принят', ok_text:'Номер вашего заказа: {n}. Сохраните его: по номеру и телефону можно проверить статус. Мы скоро свяжемся.',
  s_text:'Текст', s_photo:'своё фото', s_ref:'по описанию', s_design:'дизайн', s_scale:'Размер рисунка',
  t_title:'Как это происходит', lead_label:'Срок', pay_label:'Оплата', del_label:'Доставка',
  steps:[{b:'Заказ принят',s:'Подтверждаем макет и предоплату'},{b:'Пошив заготовки',s:'Футболка шьётся под ваш заказ'},{b:'Нанесение',s:'Печать или вышивка по вашему макету'},{b:'У тебя',s:'Отправляем заказ вам'}],
  track_title:'Статус заказа', track_number:'Номер заказа (N-1001)', track_phone:'Телефон', track_btn:'Проверить', track_nf:'Заказ не найден. Проверьте номер и телефон.',
  status:{new:'Принят в обработку',confirmed:'Подтверждён',sewing:'Идёт пошив',printing:'Нанесение рисунка',shipped:'Отправлен',done:'Выполнен',cancelled:'Отменён'}
},
uz: {
  nav_coll:'Kolleksiya', coll_title:'Norm kolleksiyasi', coll_sub:'Bizning kiyimlar: futbolkalar, polo, hudi, kepkalar, shortiklar va shimlar. Yoqdimi — konstruktorda o‘zingiznikini yarating.', nav_build:'Konstruktor', nav_gallery:'Dizaynlar', hero_title:'Norma — bu zerikarli.',
  hero_lead:"Deyarli hamma qo'ng'iroq shaklidagi egri chiziqning o'rtasida turadi. O'zing qayerda turganingni bil va hech kimda yo'q futbolka yarat. Print yoki kashta, o'z rasming yoki yozuving, buyurtma asosida.",
  curve_alt:"Normal taqsimot egri chizig'i: nuqtalarning ko'pchiligi o'rtada, sening nuqtang qizil", you:'sen', norm:'norma',
  q_step:'{m} tadan {n}-savol', result_label:'Natijang', apply:'Shunday yig‘ish', again:'Qaytadan o‘tish',
  quiz:[
    {q:"Ko'chada ketyapsan. Sizga qanday qarashadi?",a:["Hech qanday","Ba'zan o'girilib qarashadi","Suratga olishadi"]},
    {q:"Ertalab birinchi nimani ochasan?",a:["Yozishmani","Lentani","O'z sahifangni"]},
    {q:"Futbolka sen uchun…",a:["Shunchaki qulay","Obrazning bir qismi","Bayonot"]}],
  res:[
    {t:'Sokin norma',p:"Sen baqirmaysan, lekin tafsilotlarni ko'rasan. Ko'krakdagi kashta senga mos: yaqindan ko'rinadi.",text:'Norm'},
    {t:'Baland norma',p:"Narsa sen uchun gapirishini yoqtirasan. Och rangli futbolka va so'zing yozilgan katta print.",text:'Sen norma'},
    {t:'Normadan tashqari',p:"Sen allaqachon egri chiziq chetidasan. To'q futbolka va orqasida ibora: orqangdan o'qishsin.",text:'Not norm'}],
  gal_title:'Azastorm dizaynlari', gal_sub:"Tayyor mualliflik ishlari. Dizayn, futbolka rangi va o'lchamini tanla, qolganini buyurtma asosida qilamiz.", from:'dan', choose:'Tanlash',
  b_title:'Konstruktor', b_sub:"Futbolka va nusxa turini tanla. Rasmni kattalashtirish, kichraytirish va surish mumkin. Hammasi oldindan buyurtma bilan tikiladi va ishlanadi, bizda tayyor mahsulot yo'q.",
  color:'Rang', kind:'Nusxa turi', kind_print:'Print', kind_emb:'Kashta', place:'Joyi', place_front:"Ko'krak", place_back:'Orqa',
  art:'Rasm', art_text:'Yozuv', art_photo:"O'z suratim", art_ref:"Tavsif bo'yicha",
  text_aria:'Futbolkadagi yozuv', photo_aria:'Surat yuklash',
  photo_note:"Surat futbolkaga rasm sifatida joylashadi va buyurtma bilan birga yuboriladi. Kashta uchun rasmni bir necha rangga soddalashtiramiz.",
  ref_desc:"G'oyani tasvirlang: nima chizilgan, qanday uslub, qanday ranglar", ref_link:"Namuna havolasi (Pinterest, Instagram…)",
  ref_note:"Tavsif va namuna bo'yicha maket chizamiz va to'lovdan oldin tasdiqlash uchun yuboramiz.",
  chosen:'Tanlangan dizayn:', other:'Boshqasini tanlash', adjust:"O'lcham va joylashuv", scale:"O'lcham", mx:"Chapga / o'ngga", my:'Yuqoriga / pastga', reset:'Tiklash',
  tee_size:"Futbolka o'lchami", price_na:'Narx aniqlanmoqda', mock_art:'rasming', mock_ref:'maket yuboramiz', currency:"so'm", to_order:'Oldindan buyurtma berish',
  o_title:'Oldindan buyurtma', o_sub:"Kontaktlaringizni qoldiring, biz bog'lanib, maket, narx va muddatni tasdiqlaymiz.",
  name:'Ism', phone:'Telefon', city:'Shahar va yetkazish manzili', comment:'Izoh', summary:'Buyurtmangiz', submit:'Buyurtmani yuborish', sending:'Yuborilmoqda…',
  need_size:"Konstruktorda futbolka o'lchamini tanlang.", need_contact:'Ism va telefonni kiriting.', err:"Yuborib bo'lmadi. Qayta urinib ko'ring yoki Instagramda yozing.",
  ok_title:'Buyurtma qabul qilindi', ok_text:"Buyurtma raqamingiz: {n}. Uni saqlang: raqam va telefon bo'yicha holatni tekshirish mumkin. Tez orada bog'lanamiz.",
  s_text:'Yozuv', s_photo:"o'z surati", s_ref:"tavsif bo'yicha", s_design:'dizayn', s_scale:"Rasm o'lchami",
  t_title:'Bu qanday sodir bo‘ladi', lead_label:'Muddat', pay_label:"To'lov", del_label:'Yetkazib berish',
  steps:[{b:'Buyurtma qabul qilindi',s:"Maket va oldindan to'lovni tasdiqlaymiz"},{b:'Futbolka tikish',s:'Futbolka buyurtmangiz uchun tikiladi'},{b:'Nusxa tushirish',s:'Maketingiz bo‘yicha print yoki kashta'},{b:'Sizda',s:'Buyurtmani sizga yuboramiz'}],
  track_title:'Buyurtma holati', track_number:'Buyurtma raqami (N-1001)', track_phone:'Telefon', track_btn:'Tekshirish', track_nf:"Buyurtma topilmadi. Raqam va telefonni tekshiring.",
  status:{new:'Qayta ishlashga qabul qilindi',confirmed:'Tasdiqlandi',sewing:'Tikilmoqda',printing:'Rasm tushirilmoqda',shipped:'Yuborildi',done:'Bajarildi',cancelled:'Bekor qilindi'}
},
en: {
  nav_coll:'Collection', coll_title:'Norm collection', coll_sub:'Our pieces: tees, polos, hoodies, caps, shorts and pants. Like it? Build your own in the builder.', nav_build:'Builder', nav_gallery:'Designs', hero_title:'Norm is boring.',
  hero_lead:'Almost everyone stands in the middle of the bell. Find out where you stand and build a tee nobody else has. Print or embroidery, your artwork or your words, made to order.',
  curve_alt:'Normal distribution curve: most dots in the middle, your dot is red', you:'you', norm:'norm',
  q_step:'Question {n} of {m}', result_label:'Your result', apply:'Build this one', again:'Start over',
  quiz:[
    {q:'You walk down the street. How do people look at you?',a:['They don\'t','Some turn around','They take photos']},
    {q:'What do you open first in the morning?',a:['Messages','The feed','My own page']},
    {q:'To you, a t-shirt is…',a:['Just comfortable','Part of the look','A statement']}],
  res:[
    {t:'Quiet norm',p:'You don\'t shout, but you notice details. Embroidery on the chest suits you: you see it up close.',text:'Norm'},
    {t:'Loud norm',p:'You like it when your clothes speak for you. A light tee and a big print with your word.',text:'You are norm'},
    {t:'Off the norm',p:'You are already past the edge of the bell. A dark tee and a phrase on the back, let them read it as you walk away.',text:'Not norm'}],
  gal_title:'Azastorm designs', gal_sub:'Ready-made original artworks. Pick a design, a tee color and a size, we make the rest to order.', from:'from', choose:'Choose',
  b_title:'Builder', b_sub:'Pick the blank and the decoration. You can enlarge, shrink and move the artwork. Everything is sewn and decorated to order, we keep nothing in stock.',
  color:'Color', kind:'Decoration', kind_print:'Print', kind_emb:'Embroidery', place:'Placement', place_front:'Chest', place_back:'Back',
  art:'Artwork', art_text:'Text', art_photo:'My photo', art_ref:'From description',
  text_aria:'Text on the t-shirt', photo_aria:'Upload a photo',
  photo_note:'The photo is placed on the tee as artwork and is sent with your order. For embroidery we simplify the picture to a few colors.',
  ref_desc:'Describe the idea: what is drawn, which style, which colors', ref_link:'Reference link (Pinterest, Instagram…)',
  ref_note:'We will draw a mockup from your description and reference and send it for approval before payment.',
  chosen:'Selected design:', other:'Choose another', adjust:'Size and position', scale:'Size', mx:'Left / right', my:'Up / down', reset:'Reset',
  tee_size:'T-shirt size', price_na:'Price on request', mock_art:'your artwork', mock_ref:'we\'ll send a mockup', currency:'UZS', to_order:'Place a pre-order',
  o_title:'Pre-order', o_sub:'Leave your contacts and we will get in touch to confirm the mockup, price and timing.',
  name:'Name', phone:'Phone', city:'City and delivery address', comment:'Comment', summary:'Your order', submit:'Send order', sending:'Sending…',
  need_size:'Choose a t-shirt size in the builder.', need_contact:'Enter your name and phone.', err:'Could not send. Try again or message us on Instagram.',
  ok_title:'Order received', ok_text:'Your order number: {n}. Keep it: you can check the status with the number and your phone. We will contact you soon.',
  s_text:'Text', s_photo:'own photo', s_ref:'from description', s_design:'design', s_scale:'Artwork size',
  t_title:'How it works', lead_label:'Lead time', pay_label:'Payment', del_label:'Delivery',
  steps:[{b:'Order received',s:'We confirm the mockup and the prepayment'},{b:'Sewing the blank',s:'The tee is made for your order'},{b:'Decoration',s:'Print or embroidery from your mockup'},{b:'With you',s:'We send the order to you'}],
  track_title:'Order status', track_number:'Order number (N-1001)', track_phone:'Phone', track_btn:'Check', track_nf:'Order not found. Check the number and phone.',
  status:{new:'Received',confirmed:'Confirmed',sewing:'Being sewn',printing:'Decoration in progress',shipped:'Shipped',done:'Completed',cancelled:'Cancelled'}
}
};

// Дополнительные тексты: вход, фото сайта, референсы
Object.assign(window.I18N.ru, {
  intro_title:'Norm', intro_crowd:'Почти все стоят здесь.', intro_where:'А где стоишь ты? Нажми, чтобы бросить свою точку.',
  intro_in:'Ты в толпе. Это норма. Скучно.', intro_out:'Ты вне нормы. Добро пожаловать.', intro_enter:'Войти', intro_skip:'Пропустить',
  look_title:'Lookbook', about_title:'О бренде', process_title:'Как мы делаем',
  ref_btn:'Показать на футболке', ref_loading:'Загружаем картинку…',
  ref_ok:'Это черновик: референс показан на футболке. Финальный макет мы нарисуем сами и пришлём на утверждение до оплаты.',
  ref_fail:'Не получилось взять картинку по ссылке. Сохраните изображение и загрузите его во вкладке «Своё фото».',
  ref_host:'Эта ссылка не поддерживается. Подходят Pinterest, Behance, Imgur, Unsplash, или загрузите файл во вкладке «Своё фото».',
  rights:'Это моё изображение или у меня есть право его использовать', need_rights:'Подтвердите права на изображение.'
});
Object.assign(window.I18N.uz, {
  intro_title:'Norm', intro_crowd:"Deyarli hamma shu yerda turadi.", intro_where:"Sen-chi, qayerda turasan? Nuqtangni tashlash uchun bos.",
  intro_in:"Sen olomonsan. Bu norma. Zerikarli.", intro_out:"Sen normadan tashqarisan. Xush kelibsan.", intro_enter:'Kirish', intro_skip:"O'tkazib yuborish",
  look_title:'Lookbook', about_title:'Brend haqida', process_title:'Biz buni qanday qilamiz',
  ref_btn:"Futbolkada ko'rsatish", ref_loading:'Rasm yuklanmoqda…',
  ref_ok:"Bu qoralama: namuna futbolkada ko'rsatildi. Yakuniy maketni o'zimiz chizib, to'lovdan oldin tasdiqlash uchun yuboramiz.",
  ref_fail:"Havola bo'yicha rasmni olib bo'lmadi. Rasmni saqlab, «O'z suratim» bo'limiga yuklang.",
  ref_host:"Bu havola qo'llab-quvvatlanmaydi. Pinterest, Behance, Imgur, Unsplash mos keladi yoki «O'z suratim» bo'limiga fayl yuklang.",
  rights:"Bu mening rasmim yoki uni ishlatishga huquqim bor", need_rights:'Rasmga bo‘lgan huquqni tasdiqlang.'
});
Object.assign(window.I18N.en, {
  intro_title:'Norm', intro_crowd:'Almost everyone stands here.', intro_where:'And where do you stand? Tap to drop your dot.',
  intro_in:'You are in the crowd. That is the norm. Boring.', intro_out:'You are off the norm. Welcome.', intro_enter:'Enter', intro_skip:'Skip',
  look_title:'Lookbook', about_title:'About the brand', process_title:'How we make it',
  ref_btn:'Show on the tee', ref_loading:'Loading the image…',
  ref_ok:'This is a draft: the reference is shown on the tee. We will draw the final mockup ourselves and send it for approval before payment.',
  ref_fail:'Could not get the image from the link. Save the picture and upload it in the "My photo" tab.',
  ref_host:'This link is not supported. Pinterest, Behance, Imgur and Unsplash work, or upload a file in the "My photo" tab.',
  rights:'This is my image or I have the right to use it', need_rights:'Please confirm you have the rights to the image.'
});
