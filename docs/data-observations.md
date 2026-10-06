# Data observations from building the web prototype (v024)

The prototype displays v024 exactly as stored. These are things noticed while
building it that may deserve a correction **in the master JSON** (never in the UI).

## 1. Definitions that lost their first letter "N" (199 entries)

In these entries the raw source line reads `*c.* N…`, but v024 stores the type as
`c. n.` and the definition without its first letter. Example — Đa (Đ-0001):

- raw: `| 多 | Đa. *c.* Nhiều; thêm nhiều. |`
- v024: type `c. n.`, definition `hiều; thêm nhiều.`

This looks like the `cn_type_repair` rule ("Treat printed c. n. as one grammatical
type") also firing when a `c.` entry's definition happens to begin with N. It needs
checking against the scan before any change; the 2026 PDF was generated from the
same data, so it shows the same text. A further 151 entries have raw `*c.* n…`
followed by a capitalised word (e.g. `nMát mẻ…`); those look like genuine `c. n.`
marks and are not listed here.

| id | headword | v024 type | v024 definition (start) | raw source |
|---|---|---|---|---|
| A-059 | Áp | c. n. | găn, giữ, đè, nhận xuống. | `\| 壓 \| Áp. *c.* Ngăn, giữ, đè, nhận xuống. \|` |
| A-063 | Át | c. n. | găn. | `\| 遏 \| Át. *c.* Ngăn. \|` |
| B-0101 | Bào | c. n. | hau. | `\| 胞 \| Bào. *c.* Nhau. \|` |
| B-0104 | Bảo | c. n. | o. | `\| 飽 \| Bảo. *c.* No. \|` |
| B-0239 | Bồ | c. n. | ép mình. | `\| 匍 \| Bồ. *c.* Nép mình. \|` |
| B-0360 | Bức | c. n. | gặt, làm ngặt, ép uổng. | `\| 廹 \| Bức. *c.* Ngặt, làm ngặt, ép uổng. \|` |
| C-0045 | Cấm | c. n. | găn đón, không cho làm sự gì. | `\| 禁 \| Cấm. *c.* Ngăn đón, không cho làm sự gì. \|` |
| C-0049 | Can | c. n. | găn lại, cản lại: động phạm; mắc lấy; cá | `\| 干 \| Can. *c.* Ngăn lại, cản lại: động phạm; mắc lấy; cái thuẩn. Mười chữ số gọi là *thập` |
| C-0278 | Chi | c. n. | hánh. | `\| 枝 \| Chi. *c.* Nhánh. \|` |
| C-0291 | Chỉ | c. n. | ền, (không phải là chỉ túc). | `\| 址 \| Chỉ. *c.* Nền, (không phải là chỉ túc). \|` |
| C-0296 | Chích | c. n. | ướng. | `\| 炙 \| Chích. *c.* Nướng. \|` |
| C-0523 | Cơ | c. n. | ền. | `\| 基 \| Cơ. *c.* Nền. \|` |
| C-0597 | Cu | c. n. | gựa con; cũng hiểu là ngựa chung. | `\| 駒 \| Cu. *c.* Ngựa con; cũng hiểu là ngựa chung. \|` |
| C-0605 | Cù | c. n. | học. | `\| 劬 \| Cù. *c.* Nhọc. \|` |
| C-0611 | Cự | c. n. | găn, chống. | `\| 拒 \| Cự. *c.* Ngăn, chống. \|` |
| C-0628 | Cức | c. n. | gặt, gấp. | `\| 亟 \| Cức. *c.* Ngặt, gấp. \|` |
| C-0645 | Cung | c. n. | hà vua ngự có tầng bậc, phòng vua ngự có | `\| 宮 \| Cung. *c.* Nhà vua ngự có tầng bậc, phòng vua ngự có tường bao vòngNhà cao nóc.Giọng` |
| C-0681 | Cưu | c. n. | hóm. | `\| 鳩 \| Cưu. *c.* Nhóm. \|` |
| D-0244 | Dục | c. n. | uôi. | `\| 育 \| Dục. *c.* Nuôi. \|` |
| D-0271 | Dược | c. n. | hảy. | `\| 躍 \| Dược. *c.* Nhảy. \|` |
| D-0286 | Dưỡng | c. n. | uôi. | `\| 養 \| Dưỡng. *c.* Nuôi. \|` |
| H-0050 | Hảm | c. n. | hận xuống, lăm bức, xông vào. | `\| 陷 \| Hảm. *c.* Nhận xuống, lăm bức, xông vào. \|` |
| H-0061 | Hạn | c. n. | găn ra; chừng dỗi. | `\| 限 \| Hạn. *c.* Ngăn ra; chừng dỗi. \|` |
| H-0081 | Hảng | c. n. | hà buôn bán lớn, nhà trử hàng. | `\| 行 \| Hảng. *c.* Nhà buôn bán lớn, nhà trử hàng. \|` |
| H-0090 | Hạnh | c. n. | ết na, sự ăn ở tốt, đều nhơn lành. | `\| 行 \| Hạnh. *c.* Nết na, sự ăn ở tốt, đều nhơn lành. \|` |
| H-0119 | Hậu | c. n. | hà canh, cái đổ. | `\| 堠 \| Hậu. *c.* Nhà canh, cái đổ. \|` |
| H-0140 | Hềm | c. n. | ghi; giận; lo buồn. | `\| 嫌 \| Hềm. *c.* Nghi; giận; lo buồn. \|` |
| H-0169 | Hiểm | c. n. | gặt nghèo, trở cách, có lẽ nghi sợ. | `\| 險 \| Hiểm. *c.* Ngặt nghèo, trở cách, có lẽ nghi sợ. \|` |
| H-0179 | Hiệp | c. n. | hập làm một, giúp đỡ cho nhau. | `\| 協 \| Hiệp. *c.* Nhập làm một, giúp đỡ cho nhau. \|` |
| H-0186 | Hiểu | c. n. | ghĩ được, biết được, thấy được nghĩa lý. | `\| 曉 \| Hiểu. *c.* Nghĩ được, biết được, thấy được nghĩa lý. \|` |
| H-0225 | Hoặc | c. n. | ghi, lắm, dối, gạt. | `\| 惑 \| Hoặc. *c.* Nghi, lắm, dối, gạt. \|` |
| H-0261 | Hoành | c. n. | gang. | `\| 橫 \| Hoành. *c.* Ngang. \|` |
| H-0263 | Hoạnh | c. n. | gang dọc, phi lý, cũng là chữ hoành. | `\| 橫 \| Hoạnh. *c.* Ngang dọc, phi lý, cũng là chữ hoành. \|` |
| H-0283 | Hội | c. n. | hóm họp, đông người nhóm họp, gặp gở, hi | `\| 會 \| Hội. *c.* Nhóm họp, đông người nhóm họp, gặp gở, hiểu biết. \|` |
| H-0329 | Họp | c. n. | hóm lại. | `\| 合 \| Họp. *c.* Nhóm lại. \|` |
| H-0380 | Hủy | c. n. | ày cho, giao cho (Ủy). | `\| 委 \| Hủy. *c.* Này cho, giao cho (Ủy). \|` |
| H-0421 | Hưởng | c. n. | hờ, dùng, chịu lấy. | `\| 享 \| Hưởng. *c.* Nhờ, dùng, chịu lấy. \|` |
| K-0012 | Kế | c. n. | ối, tiếp theo. | `\| 継 \| Kế. *c.* Nối, tiếp theo. \|` |
| K-0050 | Khách | c. n. | gười lạ, người ở chỗ khác mà tới nhà mìn | `\| 客 \| Khách. *c.* Người lạ, người ở chỗ khác mà tới nhà mình, chẳng kì gần xa; người Trung` |
| K-0091 | Kháo | c. n. | ương. | `\| 靠 \| Kháo. *c.* Nương. \|` |
| K-0160 | Khinh | c. n. | hẹ, lấy làm nhẹ, khi dị, dể duôi. | `\| 輕 \| Khinh. *c.* Nhẹ, lấy làm nhẹ, khi dị, dể duôi. \|` |
| K-0219 | Khốn | c. n. | ghèo cực, cực khổ, gian nan. | `\| 困 \| Khốn. *c.* Nghèo cực, cực khổ, gian nan. \|` |
| K-0245 | Khuẩn | c. n. | ghèo khổ, khốn đốn, lúng túng. | `\| 窘 \| Khuẩn. *c.* Nghèo khổ, khốn đốn, lúng túng. \|` |
| K-0281 | Kí | c. n. | hớ, biên, ghi. | `\| 記 \| Kí. *c.* Nhớ, biên, ghi. \|` |
| K-0284 | Ký | c. n. | gựa chạy hay. | `\| 驥 \| Ký. *c.* Ngựa chạy hay. \|` |
| K-0297 | Kỳ | c. n. | hánh, đâm nhánh, có nhiều chỉa. | `\| 岐 \| Kỳ. *c.* Nhánh, đâm nhánh, có nhiều chỉa. \|` |
| K-0346 | Kim | c. n. | ay, bây giờ. | `\| 今 \| Kim. *c.* Nay, bây giờ. \|` |
| L-0133 | Lầu | c. n. | hà tầng, nhà cao, nhà vua chúa ngự. | `\| 樓 \| Lầu. *c.* Nhà tầng, nhà cao, nhà vua chúa ngự. \|` |
| L-0211 | Liêm | c. n. | gày lành, thanh sạch, tiết hạnh, bụng dạ | `\| 廉 \| Liêm. *c.* Ngày lành, thanh sạch, tiết hạnh, bụng dạ tốt ; xem xét. \|` |
| L-0223 | Liễn | c. n. | ối hiệp, làm ra một dãy dài ; chữ viết t | `\| 聯 \| Liễn. *c.* Nối hiệp, làm ra một dãy dài ; chữ viết trên dưới nối theo nhau. \|` |
| L-0251 | Lịp | c. n. | ón. | `\| 笠 \| Lịp. *c.* Nón. \|` |
| L-0367 | Lư | c. n. | hà nhỏ, lều quán, nhà ruộng. | `\| 廬 \| Lư. *c.* Nhà nhỏ, lều quán, nhà ruộng. \|` |
| L-0387 | Luật | c. n. | hững điều buộc, những phép đã định, nhữn | `\| 律 \| Luật. *c.* Những điều buộc, những phép đã định, những lẻ dạy phải làm theo, lệ phép.` |
| L-0404 | Lụy | c. n. | ước mắt. | `\| 淚 \| Lụy. *c.* Nước mắt. \|` |
| M-0025 | Mai | c. n. | gười thông tin, nói cho hai bên nam nữ k | `\| 媒 \| Mai. *c.* Người thông tin, nói cho hai bên nam nữ kết hiệp cùng nhau. \|` |
| M-0109 | Mạt | c. n. | hánh nhóc, ngọn ngành, vật nát nhỏ như b | `\| 末 \| Mạt. *c.* Nhánh nhóc, ngọn ngành, vật nát nhỏ như bột, rốt hèn, tàn tuyệt. \|` |
| M-0115 | Mật | c. n. | ước nhụy bông hoa, có thứ ong giống như  | `\| 蜜 \| Mật. *c.* Nước nhụy bông hoa, có thứ ong giống như con ruồi hút mà làm ra, có mùi ng` |
| M-0145 | Mên | c. n. | ước Cao-mên, người Cao-mên. | `\| 綿 \| Mên. *c.* Nước Cao-mên, người Cao-mên. \|` |
| M-0164 | Mị | c. n. | ịnh tà, vị lòng, lấy lòng. | `\| 媚 \| Mị. *c.* Nịnh tà, vị lòng, lấy lòng. \|` |
| M-0165 | Mị | c. n. | hắp, ngủ. | `\| 寐 \| Mị. *c.* Nhắp, ngủ. \|` |
| M-0187 | Miếu | c. n. | hà thờ thần. | `\| 廟 \| Miếu. *c.* Nhà thờ thần. \|` |
| N-0059 | Nàng | c. n. | ương(Tiếng xưng hô cho các đờn bà).Tiếng | `\| 娘 \| Nàng. *c.* Nương(Tiếng xưng hô cho các đờn bà).Tiếng Mên gọi là nen. \|` |
| N-0097 | Nể | c. n. | hà thờ ông bà. | `\| 禰 \| Nể. *c.* Nhà thờ ông bà. \|` |
| N-0123 | Nga | c. n. | gỗng. | `\| 䳘 \| Nga. *c.* Ngỗng. \|` |
| N-0137 | Ngại | c. n. | găn trở, trắc trở. | `\| 碍 \| Ngại. *c.* Ngăn trở, trắc trở. \|` |
| N-0202 | Nghệ | c. n. | ghề, công cuộc làm ăn, trồng trỉa. | `\| 藝 \| Nghệ. *c.* Nghề, công cuộc làm ăn, trồng trỉa. \|` |
| N-0227 | Nghị | c. n. | ghĩ định, nhứt tinh phải làm thế gì. | `\| 議 \| Nghị. *c.* Nghĩ định, nhứt tinh phải làm thế gì. \|` |
| N-0228 | Nghị | c. n. | ghĩa phải. | `\| 誼 \| Nghị. *c.* Nghĩa phải. \|` |
| N-0244 | Nghiệp | c. n. | ghề làm ăn; căn kiếp, sự sản, công việc  | `\| 業 \| Nghiệp. *c.* Nghề làm ăn; căn kiếp, sự sản, công việc làm ra. \|` |
| N-0273 | Ngõa | c. n. | gói. | `\| 瓦 \| Ngõa. *c.* Ngói. \|` |
| N-0277 | Ngoài | c. n. | goại phía để trông, phía bày ra trước mắ | `\| 外 \| Ngoài. *c.* Ngoại phía để trông, phía bày ra trước mắt, phía đi ra, đối với phía tro` |
| N-0333 | Ngu | c. n. | gây dại, không biết gì. | `\| 愚 \| Ngu. *c.* Ngây dại, không biết gì. \|` |
| N-0337 | Ngũ | c. n. | ăm. | `\| 五 \| Ngũ. *c.* Năm. \|` |
| N-0346 | Ngữ | c. n. | găn giữ. | `\| 禦 \| Ngữ. *c.* Ngăn giữ. \|` |
| N-0366 | Nguyên | c. n. | guồn, suối. | `\| 源 \| Nguyên. *c.* Nguồn, suối. \|` |
| N-0389 | Nguồn | c. n. | gọn suối. | `\| 源 \| Nguồn. *c.* Ngọn suối. \|` |
| N-0391 | Ngưởng | c. n. | gửa, ngước, ước trông. | `\| 仰 \| Ngưởng. *c.* Ngửa, ngước, ước trông. \|` |
| N-0396 | Nha | c. n. | hà quan ở, nhà làm việc quan, chỗ tra xử | `\| 衙 \| Nha. *c.* Nhà quan ở, nhà làm việc quan, chỗ tra xử việc kiện thưa. \|` |
| N-0400 | Nhã | c. n. | gày lành, xứng đáng, thanh lịch. | `\| 雅 \| Nhã. *c.* Ngày lành, xứng đáng, thanh lịch. \|` |
| N-0447 | Nhẫn | c. n. | hịn, chịu, nỡ, tiếng trợ từ. | `\| 忍 \| Nhẫn. *c.* Nhịn, chịu, nỡ, tiếng trợ từ. \|` |
| N-0456 | Nhành | c. n. | hánh. | `\| 梗 \| Nhành. *c.* Nhánh. \|` |
| N-0514 | Nhiễm | c. n. | huốm. | `\| 染 \| Nhiễm. *c.* Nhuốm. \|` |
| N-0517 | Nhiệt | c. n. | óng. | `\| 熱 \| Nhiệt. *c.* Nóng. \|` |
| N-0562 | Nhơn | c. n. | gười. | `\| 人 \| Nhơn. *c.* Người. \|` |
| N-0564 | Nhơn | c. n. | hà gái, cha mẹ nhà gái. | `\| 姻 \| Nhơn. *c.* Nhà gái, cha mẹ nhà gái. \|` |
| N-0603 | Nhục | c. n. | huốc, xấu hổ. | `\| 辱 \| Nhục. *c.* Nhuốc, xấu hổ. \|` |
| N-0604 | Nhuệ | c. n. | họn sắc. | `\| 銳 \| Nhuệ. *c.* Nhọn sắc. \|` |
| N-0631 | Nhuốm | c. n. | huộm lấy, nhiễm lấy. | `\| 染 \| Nhuốm. *c.* Nhuộm lấy, nhiễm lấy. \|` |
| N-0655 | Niên | c. n. | ăm, tuổi. | `\| 年 \| Niên. *c.* Năm, tuổi. \|` |
| N-0660 | Niết | c. n. | ắm, cầm, bày ra. | `\| 揑 \| Niết. *c.* Nắm, cầm, bày ra. \|` |
| N-0689 | Nỗ | c. n. | á. | `\| 弩 \| Nỗ. *c.* Ná. \|` |
| N-0727 | Nông | c. n. | ghề làm ruộng. | `\| 農 \| Nông. *c.* Nghề làm ruộng. \|` |
| N-0743 | Nữ | c. n. | gười nữ. | `\| 女 \| Nữ. *c.* Người nữ. \|` |
| O-0008 | Ô | c. n. | hơ, nước dơ. | `\| 汙 \| Ô. *c.* Nhơ, nước dơ. \|` |
| O-0018 | Oa | c. n. | ồi. | `\| 鍋 \| Oa. *c.* Nồi. \|` |
| O-0036 | Ốc | c. n. | hà. | `\| 屋 \| Ốc. *c.* Nhà. \|` |
| P-0012 | Phái | c. n. | gả sông, rạch, sai bát, hủy việc; giấy p | `\| 派 \| Phái. *c.* Ngả sông, rạch, sai bát, hủy việc; giấy phép. \|` |
| P-0112 | Phiền | c. n. | hiều, bề bộn. | `\| 繁 \| Phiền. *c.* Nhiều, bề bộn. \|` |
| P-0129 | Phố | c. n. | hà buôn bán thường cất dọc chợ; nhà bán  | `\| 舖 \| Phố. *c.* Nhà buôn bán thường cất dọc chợ; nhà bán hàng xén. \|` |
| P-0154 | Phòng | c. n. | gừa, dự bị. | `\| 防 \| Phòng. *c.* Ngừa, dự bị. \|` |
| P-0165 | Phụ | c. n. | ương, cậy. | `\| 附 \| Phụ. *c.* Nương, cậy. \|` |
| P-0173 | Phù | c. n. | âng đỡ, giúp đỡ. | `\| 扶 \| Phù. *c.* Nâng đỡ, giúp đỡ. \|` |
| P-0174 | Phù | c. n. | ổi, linh đinh, trôi nổi. | `\| 浮 \| Phù. *c.* Nổi, linh đinh, trôi nổi. \|` |
| P-0188 | Phục | c. n. | ép, cúi xuống. | `\| 伏 \| Phục. *c.* Nép, cúi xuống. \|` |
| Q-0010 | Quắc | c. n. | hặm lẹ, chằm hằm. | `\| 矍 \| Quắc. *c.* Nhặm lẹ, chằm hằm. \|` |
| Q-0032 | Quan | c. n. | guyên một chuỗi 600 đồng tiền. | `\| 貫 \| Quan. *c.* Nguyên một chuỗi 600 đồng tiền. \|` |
| Q-0035 | Quán | c. n. | hà rước bộ hành, chòi lều cất dọc đàng,  | `\| 舘 \| Quán. *c.* Nhà rước bộ hành, chòi lều cất dọc đàng, để bán đồ ăn cho bộ hành, hoặc b` |
| Q-0046 | Quân | c. n. | hững người nhà nước hay là vua chúa dùng | `\| 軍 \| Quân. *c.* Những người nhà nước hay là vua chúa dùng mà làm binh lính, cả thẩy 12500` |
| Q-0086 | Quê | c. n. | gọc quê, vật chết trên tròn dưới vuông g | `\| 圭 \| Quê. *c.* Ngọc quê, vật chết trên tròn dưới vuông gọi là quê. \|` |
| Q-0143 | Quốc | c. n. | ước, đất nước. | `\| 國 \| Quốc. *c.* Nước, đất nước. \|` |
| Q-0147 | Quờn | c. n. | ắm tay; đánh quờn | `\| 拳 \| Quờn. *c.* Nắm tay; đánh quờn \|` |
| S-0056 | San | c. n. | ước mắt tuôn rơi. | `\| 澘 \| San. *c.* Nước mắt tuôn rơi. \|` |
| S-0148 | Sí | c. n. | hảy mũi. | `\| 嚏 \| Sí. *c.* Nhảy mũi. \|` |
| T-0006 | Tạ | c. n. | hà trống, nhà không vách. | `\| 榭 \| Tạ. *c.* Nhà trống, nhà không vách. \|` |
| T-0007 | Tạ | c. n. | hờ, mượn. | `\| 藉 \| Tạ. *c.* Nhờ, mượn. \|` |
| T-0027 | Tai | c. n. | hững đều họa hại, khốn khổ, thường bỡi t | `\| 災 \| Tai. *c.* Những đều họa hại, khốn khổ, thường bỡi trời mà xuống. \|` |
| T-0062 | Tẩm | c. n. | gâm, dầm. | `\| 浸 \| Tẩm. *c.* Ngâm, dầm. \|` |
| T-0088 | Tần | c. n. | ăng. | `\| 頻 \| Tần. *c.* Năng. \|` |
| T-0095 | Tạng | c. n. | ăm vật ở trong bụng mà thuộc về trong là | `\| 臟 \| Tạng. *c.* Năm vật ở trong bụng mà thuộc về trong là tâm, can, tì, phế, thận, nói nô` |
| T-0126 | Tào | c. n. | ước chuyển vận, khai đảng nước. | `\| 漕 \| Tào. *c.* Nước chuyển vận, khai đảng nước. \|` |
| T-0135 | Tập | c. n. | hóm, xắp. | `\| 集 \| Tập. *c.* Nhóm, xắp. \|` |
| T-0136 | Tập | c. n. | oi, úp. | `\| 襲 \| Tập. *c.* Noi, úp. \|` |
| T-0167 | Tế | c. n. | hỏ mọn, kĩ lưỡng. | `\| 細 \| Tế. *c.* Nhỏ mọn, kĩ lưỡng. \|` |
| T-0272 | Thành | c. n. | ên, hóa nên ; làm nên, giúp đỡ. | `\| 成 \| Thành. *c.* Nên, hóa nên ; làm nên, giúp đỡ. \|` |
| T-0301 | Thất | c. n. | hà, buồng. | `\| 室 \| Thất. *c.* Nhà, buồng. \|` |
| T-0311 | Thẩu | c. n. | hựa nha phiến, nhựa phủ dung, (Tiếng Tri | `\| 土 \| Thẩu. *c.* Nhựa nha phiến, nhựa phủ dung, (Tiếng Triều-châu). \|` |
| T-0324 | Thế | c. n. | ước mắt. | `\| 涕 \| Thế. *c.* Nước mắt. \|` |
| T-0389 | Thiểm | c. n. | huốc, tiếng xưng mình. | `\| 沗 \| Thiểm. *c.* Nhuốc, tiếng xưng mình. \|` |
| T-0394 | Thiên | c. n. | gàn, mười trăm. | `\| 千 \| Thiên. *c.* Ngàn, mười trăm. \|` |
| T-0416 | Thiệu | c. n. | ối; Bài bàn tập nghề võ. | `\| 紹 \| Thiệu. *c.* Nối; Bài bàn tập nghề võ. \|` |
| T-0418 | Thiều | c. n. | hạc vua Thuấn. | `\| 韶 \| Thiều. *c.* Nhạc vua Thuấn. \|` |
| T-0425 | Thính | c. n. | hà việc quan, nhà khách. | `\| 廳 \| Thính. *c.* Nhà việc quan, nhà khách. \|` |
| T-0426 | Thính | c. n. | ghe, vâng theo. | `\| 聽 \| Thính. *c.* Nghe, vâng theo. \|` |
| T-0533 | Thú | c. n. | gữ tại biên thùy, giữ bờ cõi, ở theo đồn | `\| 戍 \| Thú. *c.* Ngữ tại biên thùy, giữ bờ cõi, ở theo đồn lũy xa. \|` |
| T-0552 | Thử | c. n. | ày, ấy. | `\| 此 \| Thử. *c.* Này, ấy. \|` |
| T-0553 | Thử | c. n. | ắng. | `\| 暑 \| Thử. *c.* Nắng. \|` |
| T-0562 | Thừa | c. n. | ương, nhơn, cỡi. | `\| 乘 \| Thừa. *c.* Nương, nhơn, cỡi. \|` |
| T-0600 | Thuyết | c. n. | ói; lời nói; lời dạy. | `\| 說 \| Thuyết. *c.* Nói; lời nói; lời dạy. \|` |
| T-0629 | Thương | c. n. | ước minh mông. | `\| 滄 \| Thương. *c.* Nước minh mông. \|` |
| T-0638 | Thường | c. n. | êm, thử, tầng; lễ tế mùa thu. | `\| 嘗 \| Thường. *c.* Nêm, thử, tầng; lễ tế mùa thu. \|` |
| T-0687 | Tiên | c. n. | hững người tu đặng phép trường sinh bất  | `\| 仙 \| Tiên. *c.* Những người tu đặng phép trường sinh bất tử, các vì thần thánh. \|` |
| T-0704 | Tiệt | c. n. | găn, dứt. | `\| 截 \| Tiệt. *c.* Ngăn, dứt. \|` |
| T-0705 | Tiết | c. n. | ết na, sự ăn ở có chừng có mực, mùa màng | `\| 節 \| Tiết. *c.* Nết na, sự ăn ở có chừng có mực, mùa màng, ngày tháng, khí hậu trong năm.` |
| T-0709 | Tiêu | c. n. | êu. | `\| 標 \| Tiêu. *c.* Nêu. \|` |
| T-0724 | Tiểu | c. n. | hỏ, hèn. | `\| 小 \| Tiểu. *c.* Nhỏ, hèn. \|` |
| T-0772 | Tọa | c. n. | gồi, mắc. | `\| 坐 \| Tọa. *c.* Ngồi, mắc. \|` |
| T-0777 | Tỏa | c. n. | hỏ mọn, lắt nhắt. | `\| 瑣 \| Tỏa. *c.* Nhỏ mọn, lắt nhắt. \|` |
| T-0815 | Tốn | c. n. | hường, khiêm nhường. | `\| 遜 \| Tốn. *c.* Nhường, khiêm nhường. \|` |
| T-0826 | Tống | c. n. | ước Tống, nhà Tống, (Trung-quốc). | `\| 宋 \| Tống. *c.* Nước Tống, nhà Tống, (Trung-quốc). \|` |
| T-0846 | Trắc | c. n. | ghiêng, bên. | `\| 側 \| Trắc. *c.* Nghiêng, bên. \|` |
| T-0854 | Trạch | c. n. | hà, chỗ ở. | `\| 宅 \| Trạch. *c.* Nhà, chỗ ở. \|` |
| T-0858 | Trại | c. n. | hà trống để mà làm công việc, hoặc chất  | `\| 寨 \| Trại. *c.* Nhà trống để mà làm công việc, hoặc chất để đồ dùng; nhà canh giữ, chỗ đó` |
| T-0860 | Trái | c. n. | ợ; sái, nghịch tự, không thuận; không nh | `\| 債 \| Trái. *c.* Nợ; sái, nghịch tự, không thuận; không nhằm. \|` |
| T-1001 | Triền | c. n. | oi. | `\| 躔 \| Triền. *c.* Noi. \|` |
| T-1015 | Trinh | c. n. | gay, chính. | `\| 貞 \| Trinh. *c.* Ngay, chính. \|` |
| T-1038 | Trở | c. n. | găn đón, cấm ngăn; cách bức; xây lại, da | `\| 阻 \| Trở. *c.* Ngăn đón, cấm ngăn; cách bức; xây lại, day lại, lộn lại; biến ra thể khác.` |
| T-1073 | Trọng | c. n. | ặng, cả thể; quý báu, cao sang, sang cả. | `\| 重 \| Trọng. *c.* Nặng, cả thể; quý báu, cao sang, sang cả. \|` |
| T-1098 | Trù | c. n. | hà bếp. | `\| 廚 \| Trù. *c.* Nhà bếp. \|` |
| T-1115 | Trực | c. n. | gay, thẳng, mực thước, cách thể. | `\| 直 \| Trực. *c.* Ngay, thẳng, mực thước, cách thể. \|` |
| T-1131 | Trung | c. n. | gay thật, một lòng. | `\| 忠 \| Trung. *c.* Ngay thật, một lòng. \|` |
| T-1133 | Trúng | c. n. | hằm, đụng nhằm, mắc phải. | `\| 中 \| Trúng. *c.* Nhằm, đụng nhằm, mắc phải. \|` |
| T-1159 | Trường | c. n. | hà dạy học; chỗ lập ra cho người ta tran | `\| 場 \| Trường. *c.* Nhà dạy học; chỗ lập ra cho người ta tranh đua việc văn, việc võ; chỗ đ` |
| T-1175 | Tụ | c. n. | hóm họp, tên chỗ ở trên Ngâu, (Bắc-kỳ). | `\| 聚 \| Tụ. *c.* Nhóm họp, tên chỗ ở trên Ngâu, (Bắc-kỳ). \|` |
| T-1185 | Tư | c. n. | ay, nấy. | `\| 兹 \| Tư. *c.* Nay, nấy. \|` |
| T-1186 | Tư | c. n. | hờ cậy;của cải. | `\| 資 \| Tư. *c.* Nhờ cậy;của cải. \|` |
| T-1194 | Tự | c. n. | ghỉ, mình; bỡi. | `\| 自 \| Tự. *c.* Nghỉ, mình; bỡi. \|` |
| T-1196 | Tự | c. n. | ối. | `\| 嗣 \| Tự. *c.* Nối. \|` |
| T-1200 | Tứ | c. n. | gựa tứ, ngựa bốn con mắc một xe. | `\| 駟 \| Tứ. *c.* Ngựa tứ, ngựa bốn con mắc một xe. \|` |
| T-1238 | Tục | c. n. | ối, thêm. | `\| 續 \| Tục. *c.* Nối, thêm. \|` |
| T-1252 | Tụy | c. n. | hóm. | `\| 萃 \| Tụy. *c.* Nhóm. \|` |
| T-1258 | Tuyền | c. n. | guồn, suối, (xưa dụng như chữ tiền). | `\| 泉 \| Tuyền. *c.* Nguồn, suối, (xưa dụng như chữ tiền). \|` |
| T-1266 | Tung | c. n. | on cao. | `\| 嵩 \| Tung. *c.* Non cao. \|` |
| T-1294 | Tương | c. n. | hau, cùng, chung cùng. | `\| 相 \| Tương. *c.* Nhau, cùng, chung cùng. \|` |
| T-1304 | Tường | c. n. | hà học. | `\| 庠 \| Tường. *c.* Nhà học. \|` |
| T-1306 | Tưởng | c. n. | ghĩ đến, suy nghĩ, ngẫm nghĩ. | `\| 想 \| Tưởng. *c.* Nghĩ đến, suy nghĩ, ngẫm nghĩ. \|` |
| U-0021 | Ức | c. n. | gực. | `\| 臆 \| Ức. *c.* Ngực. \|` |
| V-0036 | Vầy | c. n. | hóm họp, xúm xít; vây quanh. | `\| 圍 \| Vầy. *c.* Nhóm họp, xúm xít; vây quanh. \|` |
| V-0050 | Văn | c. n. | ghe. | `\| 聞 \| Văn. *c.* Nghe. \|` |
| V-0131 | Vi | c. n. | hỏ mọn, sâu nhiệm, kín nhiệm. | `\| 微 \| Vi. *c.* Nhỏ mọn, sâu nhiệm, kín nhiệm. \|` |
| V-0134 | Vị | c. n. | gôi vị, ngôi thứ, chỗ đứng, chỗ ngồi. | `\| 位 \| Vị. *c.* Ngôi vị, ngôi thứ, chỗ đứng, chỗ ngồi. \|` |
| V-0142 | Vì | c. n. | gôi, chỗ. | `\| 位 \| Vì. *c.* Ngôi, chỗ. \|` |
| V-0159 | Viện | c. n. | hà cữa có xây tường bao. | `\| 院 \| Viện. *c.* Nhà cữa có xây tường bao. \|` |
| V-0188 | Vỏ | c. n. | hà. | `\| 宇 \| Vỏ. *c.* Nhà. \|` |
| X-0032 | Xàm | c. n. | ói quấy quá, chạ lác; nói như đứa điên. | `\| 譫 \| Xàm. *c.* Nói quấy quá, chạ lác; nói như đứa điên. \|` |
| X-0112 | Xí | c. n. | hà tiêu. | `\| 厠 \| Xí. *c.* Nhà tiêu. \|` |
| Y-0001 | Y | c. n. | ương, nương theo. | `\| 依 \| Y. *c.* Nương, nương theo. \|` |
| Y-0002 | Y | c. n. | ó, người ấy. | `\| 伊 \| Y. *c.* Nó, người ấy. \|` |
| Y-0014 | Yểm | c. n. | hảm, đè nhận xuống. | `\| 厭 \| Yểm. *c.* Nhảm, đè nhận xuống. \|` |
| Y-0026 | Yêu | c. n. | hỏ. | `\| 幺 \| Yêu. *c.* Nhỏ. \|` |
| Đ-0001 | Đa | c. n. | hiều; thêm nhiều. | `\| 多 \| Đa. *c.* Nhiều; thêm nhiều. \|` |
| Đ-0022 | Đài | c. n. | hà cao, chỗ đổ nền cao, hoặc làm ra nhiề | `\| 䑓 \| Đài. *c.* Nhà cao, chỗ đổ nền cao, hoặc làm ra nhiều tầng; tầng bậc; tiếng trợ từ. \|` |
| Đ-0040 | Đàm | c. n. | ói năng; chuyện vãn. | `\| 談 \| Đàm. *c.* Nói năng; chuyện vãn. \|` |
| Đ-0041 | Đàm | c. n. | ước tân dịch đặc lại, hay ở trong cổ, lú | `\| 痰 \| Đàm. *c.* Nước tân dịch đặc lại, hay ở trong cổ, lúc kêu là đờm. \|` |
| Đ-0054 | Đán | c. n. | gằy, sớm. | `\| 旦 \| Đán. *c.* Ngằy, sớm. \|` |
| Đ-0057 | Đàn | c. n. | ền đắp để mà tế lễ, nền tế lễ. | `\| 壇 \| Đàn. *c.* Nền đắp để mà tế lễ, nền tế lễ. \|` |
| Đ-0176 | Đích | c. n. | ước nhỏ xuống từ hột. | `\| 滴 \| Đích. *c.* Nước nhỏ xuống từ hột. \|` |
| Đ-0208 | Điều | c. n. | hánh, đoạn, thứ tiết. | `\| 條 \| Điều. *c.* Nhánh, đoạn, thứ tiết. \|` |
| Đ-0295 | Đờm | c. n. | ước nhớt dẻo có khi đặc lại, ở trong cổ  | `\| 痰 \| Đờm. *c.* Nước nhớt dẻo có khi đặc lại, ở trong cổ họng mà ra. (Coi chữ đàm). \|` |
| Đ-0390 | Đường | c. n. | hà. (Coi chữ đàng). | `\| 堂 \| Đường. *c.* Nhà. (Coi chữ đàng). \|` |

## 2. Smaller things

- Some subentry definitions contain escaped Markdown from the digitised source, e.g. `mạnh\:mùa` (under Đổ). Displayed as stored.
- The expanded `term` field capitalises the headword inside phrases (`Nước Bí` for printed `Nước ―` under Bí; `Thái A`). The "Dạng in" toggle shows the printed form. A lower-case expansion would read better in search results.
- B-0047 (Bấm) is `image_only` with `han: null`, while its `scan_correction_note` says the scan shows 𢶸 and `correction_status.bam_scan_correction` records `han: 𢶸`. The prototype follows the entry fields (image) and shows the note in the source panel.
- `hanImage` is an object for 22 entries and a bare string for C-0360. The build script accepts both.
- All letter files say `volume: 1`, although Tome II (1896) exists. The prototype does not show a tome per entry.
- The v024 zip references 23 glyph images but ships only `hn/C-0360.png`. The other 22 were taken from the 2026 PDF (see `public/glyphs/dnqatv/PROVENANCE.md`).
