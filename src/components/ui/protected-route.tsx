// "use client";

// import { useEffect } from "react";
// import { useAuth } from "@/shared/hooks/use-auth";

// interface ProtectedRouteProps {
//   children: React.ReactNode;
// }

// export function ProtectedRoute({ children }: ProtectedRouteProps) {
//   const { isAuthenticated, isLoading } = useAuth();

//   useEffect(() => {
//     if (!isLoading && !isAuthenticated) {
//       window.location.href = "/login";
//     }
//   }, [isAuthenticated, isLoading]);

//   if (isLoading) {
//     return (
//       <div className="min-h-screen flex items-center justify-center">
//         <div className="text-center">
//           <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
//           <p className="mt-4 text-gray-600">Загрузка...</p>
//         </div>
//       </div>
//     );
//   }

//   if (!isAuthenticated) {
//     return null; // Редирект уже произойдет в useEffect
//   }

//   return <>{children}</>;
// }
