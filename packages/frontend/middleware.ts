import { get } from '@vercel/edge-config';

// Vercel 빌드 시스템이 읽어가는 설정(파일에서 사용 X)
export const config = {
  // 정적 파일, API 등을 제외한 모든 경로에서 실행
  // 제외 설정을 해주지 않으면 점검 중이 아닐 때, vercel이 요청이 올 때마다 확인하므로 
  // Edge Config 읽기 한도에 빨리 도달하게 된다.
  // assets에는 거의 모든 리액트 빌드 결과물이 들어가 있으므로 제외시켜준다.
  matcher: ['/((?!api|assets|favicon.ico|logo.png|maintenance.html).*)',],
};

export default async function middleware(req: Request) {
  try {
    // 1. Edge Config에서 상태 읽기
    const isInMaintenanceMode = await get('isInMaintenanceMode');

    if (isInMaintenanceMode) {
      // 2. 점검 중이면 maintenance.html로 리다이렉트
      const url = new URL(req.url);
      url.pathname = '/maintenance.html';
      
      // Vercel Edge에서 리다이렉트를 보내는 표준 방식
      return Response.redirect(url, 307);
    }
  } catch (error) {
    console.error('Middleware Error:', error);
  }

  // 점검 모드가 아니면 그냥 통과
  return new Response(null, {
    headers: { 'x-middleware-next': '1' },
  });
}