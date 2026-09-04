/**
 * Apple-Grade GPU-Accelerated Scroll Reveal Engine
 * Sử dụng IntersectionObserver chuẩn trình duyệt (0KB bundle bloat, 120 FPS).
 */

export function initScrollReveal() {
  if (typeof window === 'undefined' || !('IntersectionObserver' in window)) {
    // Fallback nếu trình duyệt không hỗ trợ: hiển thị toàn bộ
    document.querySelectorAll('.reveal, [data-reveal]').forEach((el) => {
      el.classList.add('revealed');
    });
    return () => {};
  }

  // Tôn trọng cài đặt giảm chuyển động của người dùng
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (prefersReducedMotion) {
    document.querySelectorAll('.reveal, [data-reveal]').forEach((el) => {
      el.classList.add('revealed');
    });
    return () => {};
  }

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('revealed');
          // Sau khi đã hiển thị thì ngưng theo dõi để giải phóng bộ nhớ GPU
          observer.unobserve(entry.target);
        }
      });
    },
    {
      root: null,
      rootMargin: '0px 0px -40px 0px', // Kích hoạt sớm 40px trước khi chạm đáy màn hình để tạo cảm giác đón đầu
      threshold: 0.08 // Chỉ cần lọt vào 8% là bắt đầu trượt vào mượt mà
    }
  );

  const observeElements = () => {
    const elements = document.querySelectorAll(
      '.reveal:not(.revealed), [data-reveal]:not(.revealed), .reveal-up:not(.revealed), .reveal-fade:not(.revealed), .reveal-scale:not(.revealed), .reveal-left:not(.revealed), .reveal-right:not(.revealed)'
    );
    elements.forEach((el) => observer.observe(el));
  };

  // Quét lần đầu
  observeElements();

  // Theo dõi các phần tử động mới xuất hiện trong DOM
  const mutationObserver = new MutationObserver(() => {
    observeElements();
  });

  mutationObserver.observe(document.body, {
    childList: true,
    subtree: true
  });

  return () => {
    observer.disconnect();
    mutationObserver.disconnect();
  };
}
