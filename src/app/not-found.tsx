import Link from "next/link";

export default function NotFound() {
  return (
    <main className="mx-auto w-full max-w-xl flex-1 px-4 py-24 text-center">
      <h1 className="font-text text-[28px] font-semibold text-ink">Không có trang này</h1>
      <p className="mt-3 text-ink-2">Mục từ hoặc chữ bạn tìm không có trong dữ liệu hiện tại.</p>
      <Link href="/" className="mt-6 inline-block text-accent hover:underline">
        Về trang tra từ
      </Link>
    </main>
  );
}
