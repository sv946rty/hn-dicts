// Platform vocabulary, kept in one place so the web app and the future native
// app use the same words for the same concepts.

export const PLATFORM = {
  /** Working name for the collection; one constant to change. */
  name: "Từ Điển Xưa",
  tagline: "Từ điển lịch sử tiếng Việt và Hán Nôm",
};

export const T = {
  searchPlaceholder: "Tra một từ…",
  searchPlaceholderAll: "Tra trong mọi từ điển…",
  searchLabel: "Tra từ",
  searchIn: "trong",
  allDictionaries: "Tất cả từ điển",
  thisDictionary: "Từ điển này",
  collection: "Bộ sưu tập",
  dictionaries: "Các từ điển",
  available: "Đã có",
  comingLater: "Sắp có",
  browse: "Duyệt A–X",
  browseShort: "Duyệt",
  exploreHan: "Chữ Hán/Nôm",
  about: "Giới thiệu",
  entries: "mục từ",
  subentries: "từ ngữ",
  results: "kết quả",
  headwords: "Mục từ",
  inSubentries: "Trong từ ngữ",
  inDefinitions: "Trong lời giải",
  noResults: "Không tìm thấy",
  printForm: "Dạng in",
  printFormHint: "Hiện từ ngữ như bản in: ― thay cho chữ đầu mục, | là dấu ngăn.",
  source: "Nguồn",
  sourceTitle: "Nguồn và bản in",
  character: "Chữ",
  characterDetails: "Chi tiết chữ",
  scholarly: "Dữ liệu nghiên cứu",
  openCharacter: "Mở trang chữ",
  previous: "Mục trước",
  next: "Mục sau",
  nearby: "Các mục lân cận",
  recent: "Vừa xem",
  copyCitation: "Chép trích dẫn",
  copied: "Đã chép",
  close: "Đóng",
} as const;

export const HAN_STATUS_LABEL: Record<string, { short: string; long: string }> = {
  unicode: { short: "Unicode", long: "Chữ đã xác định mã Unicode." },
  pua: {
    short: "Mã riêng (PUA)",
    long: "Chữ dùng mã vùng riêng (Private Use Area) của phông Nom Na Tong; chưa có mã Unicode chuẩn, nên chỉ hiển thị đúng với phông này.",
  },
  image_only: {
    short: "Hình từ bản in",
    long: "Chưa xác định được mã Unicode đủ chắc chắn, nên chữ được giữ bằng hình cắt từ bản in gốc thay vì đoán một chữ gần giống.",
  },
};
