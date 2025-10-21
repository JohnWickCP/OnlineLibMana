
import { AuthContext } from '@/components/provider/AuthProvider';
import { useContext } from 'react';

export const useAuth = () => {
  // Lấy context value
  const context = useContext(AuthContext);
  
  // Kiểm tra xem hook có được sử dụng trong AuthProvider không
  if (!context) {
    throw new Error(
      'useAuth phải được sử dụng bên trong AuthProvider. ' +
      'Hãy wrap component của bạn với <AuthProvider>.'
    );
  }
  
  return context;
};

export default useAuth;