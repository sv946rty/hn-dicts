import type { Metadata } from "next";
import Link from "next/link";
import { getStats } from "@/lib/data/dictionaries";
import { EDITION, MARKS } from "@/dictionaries/dnqatv/identity";
import { getDictionaryDescriptor, routes } from "@/platform/registry";

export const metadata: Metadata = { title: "Giới thiệu Đại Nam Quấc Âm Tự Vị" };

const nf = new Intl.NumberFormat("vi-VN");

// Everything on this page comes from the 2026 edition's front matter (cover,
// Tiểu tự, Dấu riêng, Lời dặn, Lưu ý), the v024 data or the project's info.md.
// Quotations keep the historical orthography.

export default async function AboutPage({ params }: PageProps<"/dictionaries/[dict]/about">) {
  const { dict } = await params;
  const d = getDictionaryDescriptor(dict)!;
  const stats = getStats(dict)!;

  return (
    <main className="mx-auto w-full max-w-3xl flex-1 px-4 pb-24 pt-10 sm:px-6 sm:pt-16">
      <p className="text-[12px] font-medium uppercase tracking-wider text-ink-3">Giới thiệu</p>
      <h1 className="mt-2 font-text text-[34px] font-semibold leading-tight text-accent sm:text-[42px]">{d.title}</h1>
      <p className="mt-2 font-han text-[30px] tracking-[0.2em] text-han">{d.titleHan}</p>
      <p className="mt-3 font-text text-[17px] text-ink-2">
        {d.author} · Tome I, 1895 · Tome II, 1896
      </p>

      <div className="mt-10 grid gap-8 sm:grid-cols-[minmax(0,1fr)_220px]">
        <div className="space-y-5 font-text text-[17.5px] leading-[1.75] text-ink">
          <p>
            Bộ tự vị tiếng Việt in tại Saigon năm 1895 (Tome I) và 1896 (Tome II). Bìa Tome I ghi nhan đề Pháp <em>Dictionnaire annamite</em> và lời tóm lược của chính tác phẩm:{" "}
            <em>“Tham dụng chữ nho có giải nghĩa, có dẫn chứng, mượn 24 chữ cái phương Tây làm chữ bộ.”</em>
          </p>
          <p>
            Mỗi mục từ đứng đầu bằng chữ quốc ngữ, kèm chữ nho hoặc chữ nôm, rồi đến lời giải và các từ ngữ ghép theo sau. Trong Tiểu tự, tác giả giải thích vì sao gọi sách là <em>tự-vị</em> chứ không phải <em>tự-điển</em>: tự-điển phải dẫn điển, dẫn tích cho mỗi chữ, còn tự-vị “thích chữ một, nghĩa một”, dù sách có trưng dẫn ca vãn như Ca-trù, Chinh-phụ-ngâm, Kim-vân-kiều.
          </p>
        </div>
        <figure className="sm:pt-1">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/dictionaries/dnqatv/original-cover-1895.jpg" alt="Bìa nguyên bản Tome I, Saigon 1895" className="w-full border border-rule" />
          <figcaption className="mt-2 text-[12px] leading-snug text-ink-3">Bìa nguyên bản, Tome I · Saigon · Imprimerie Rey, Curiol &amp; Cie · 1895. Theo bản điện tử 2026, tr. 2.</figcaption>
        </figure>
      </div>

      <section className="mt-14">
        <h2 className="border-b border-rule-strong pb-2 font-text text-[22px] font-semibold text-ink">Từ Tiểu tự</h2>
        <blockquote className="mt-5 space-y-4 border-l-2 border-accent pl-5 font-text text-[16.5px] leading-[1.75] text-ink-2">
          <p>
            “Ta nghĩ hể có tiếng nói, ắt phải có tự-vị làm chuẩn thẳng. Chữ nho thì cứ tự điển Khương-hi, chữ nôm chọn trong các ca vãn hay đã nói trước, cả thảy đều dùng chính nôm chính chữ ; quấc ngữ Latin thì tùy theo thói quen, giữ cho thiệt tiếng thiệt vần.”
          </p>
          <p>
            “Ta mượn 24 chữ cái phương Tây làm chữ bộ, sắp đặt theo thứ lớp cho dễ việc tra tìm, ta dụng dấu riêng như chữ c chỉ là chữ nho ; chữ n chỉ là chữ nôm ; chữ c chữ n để chung thì chỉ là chữ nho mà có dùng nôm, cả thảy đều làm ra phân biệt.”
          </p>
        </blockquote>
        <p className="mt-5 font-text text-[16.5px] leading-[1.75] text-ink">
          Tiểu tự cũng kể rằng tác giả ban đầu muốn có phần tiếng Langsa, rồi theo lời ông Landes để tự-vị “làm theo nước ấy”; sách được hội phái viên do ông Navelle làm chủ xét duyệt và quan Thống đốc Fourès cho chuẩn tiền in. Tiểu tự đề <em>Quí-tị niên cúc ngoạt cốc đán</em>; bản dịch Pháp văn của C. Cotel ghi năm 1893. Lời dặn ở Tome II: <em>“Trong tự-vị có nhiều tiếng trùng lặp, ta cũng có ý để mà coi cho chắc nghĩa.”</em>
        </p>
      </section>

      <section className="mt-14">
        <h2 className="border-b border-rule-strong pb-2 font-text text-[22px] font-semibold text-ink">Dấu riêng</h2>
        <p className="mt-3 text-[14px] text-ink-3">Theo Tiểu tự. Giao diện giữ nguyên các dấu này như bản in và chỉ thêm lời giải thích khi rê chuột.</p>
        <table className="mt-3 w-full font-text text-[16px]">
          <tbody>
            {MARKS.map((m) => (
              <tr key={m.mark} className="border-b border-rule">
                <td className="w-20 py-2 pr-4 text-center italic text-accent">{m.mark}</td>
                <td className="py-2 text-ink">{m.meaning}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>

      <section className="mt-14">
        <h2 className="border-b border-rule-strong pb-2 font-text text-[22px] font-semibold text-ink">Bản điện tử tham khảo 2026</h2>
        <div className="mt-4 space-y-4 font-text text-[16.5px] leading-[1.75] text-ink">
          <p>
            Bản PDF {nf.format(EDITION.pages)} trang giữ bố cục hai cột, chữ Hán/Nôm và đầu mục màu nâu, đường kẻ, phân trang và mục lục chi tiết; chữ trong sách tra tìm được. Bản ấy là bản đối chiếu hình thức. Bản gốc về ngữ nghĩa là bộ dữ liệu có cấu trúc{" "}
            <span className="font-mono text-[14px]">dnqatv.all.vNNN.json</span>; trang web này, như bản PDF, đều được dựng ra từ dữ liệu đó.
          </p>
          <dl className="grid grid-cols-2 gap-px overflow-hidden border border-rule bg-rule font-ui text-[14px] sm:grid-cols-4">
            {[
              [nf.format(stats.totals.entries), "mục từ"],
              [nf.format(stats.totals.subentries), "từ ngữ"],
              [String(stats.totals.letters), "vần A–X"],
              [stats.dataVersion, "phiên bản dữ liệu"],
            ].map(([v, k]) => (
              <div key={k} className="bg-bg px-4 py-3">
                <dt className="text-[12px] text-ink-3">{k}</dt>
                <dd className="font-text text-[20px] text-ink">{v}</dd>
              </div>
            ))}
          </dl>
          <p>
            Chữ Hán/Nôm của {nf.format(stats.hanStatus.unicode ?? 0)} mục đã có mã Unicode; {nf.format(stats.hanStatus.pua ?? 0)} mục dùng mã vùng riêng của phông Nom Na Tong; {nf.format(stats.hanStatus.image_only ?? 0)} mục chưa xác định được mã đủ chắc chắn nên giữ bằng hình cắt từ bản in gốc, có dấu <span className="text-han">*</span>. Dự án không đoán một chữ gần giống để thay: khi một mã được xác minh, hình mới được thay bằng chữ.
          </p>
          <p>
            Bộ, số nét lấy từ Unihan; cấu tạo chữ lấy từ CJKVI IDS (dựa trên CHISE); hỗ trợ phông được kiểm tra trực tiếp trên Nom Na Tong và BabelStone Han. Không có trường nào được đoán bằng mắt hàng loạt.
          </p>
        </div>
      </section>

      <section className="mt-14">
        <h2 className="border-b border-rule-strong pb-2 font-text text-[22px] font-semibold text-ink">Nguyên tắc giữ gìn</h2>
        <ul className="mt-4 list-disc space-y-2 pl-5 font-text text-[16.5px] leading-[1.7] text-ink">
          <li>Giữ nguyên chính tả lịch sử (Quấc, quiền, nhơn…); tra tìm có thể bỏ dấu, nhưng chữ hiển thị không bị sửa.</li>
          <li>Không sửa lời giải, không thay hay đoán chữ Hán/Nôm; chữ chưa chắc thì giữ bằng hình và nói rõ.</li>
          <li>Mục từ, từ ngữ, chữ Hán/Nôm, lời giải, nguồn và siêu dữ liệu luôn được phân biệt.</li>
          <li>Hiệu đính được làm trên dữ liệu gốc trước, rồi mới dựng lại PDF, trang web và các bản phái sinh khác.</li>
          <li>Mỗi mục đều mở được dòng dữ liệu gốc và trang tương ứng trong bản điện tử 2026.</li>
        </ul>
      </section>

      <p className="mt-14 text-[14px] text-ink-3">
        <Link href={routes.dictionary(dict)} className="text-accent hover:underline">
          ← Tra từ trong {d.title}
        </Link>
      </p>
    </main>
  );
}
