import { notFound } from "next/navigation";
import { getUserById, updateUser } from "@/app/actions/users";
import { UserEditForm } from "@/components/settings/user-edit-form";
import { getCustomers } from "@/app/actions/customers";

interface EditUserPageProps {
  params: Promise<{ id: string }>;
}

export default async function EditUserPage({ params }: EditUserPageProps) {
  const { id } = await params;
  
  const [user, customers] = await Promise.all([
    getUserById(id),
    getCustomers(),
  ]);

  if (!user) {
    notFound();
  }

  return (
    <div className="max-w-2xl mx-auto">
      <UserEditForm user={user} customers={customers} />
    </div>
  );
}
