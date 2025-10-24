/**
 * Simple password verification for basic access control
 * Note: Password is stored in plain text in env variable (client-side)
 * This is for basic "keep curious people out" protection only
 */

export function verifyPassword(inputPassword: string): boolean {
  const correctPassword = process.env.NEXT_PUBLIC_ACCESS_PASSWORD;
  
  if (!correctPassword) {
    console.error('Access password not configured');
    return false;
  }
  
  return inputPassword === correctPassword;
}
