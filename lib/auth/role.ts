const ADMIN_ROLE = ["SUPER_ADMIN", "ADMIN"] as const;

type AdminRole = (typeof ADMIN_ROLE)[number];

export function isAdminRole(
  role: string | null | undefined,  //true ဖြစ်ခဲ့မယ်ဆိုရင် AdminRole ကို returnမယ် 
): role is AdminRole {              //falseရင်တော့ string | null | undefined ကို returnမယ်
  return ADMIN_ROLE.includes(role as AdminRole);
}
