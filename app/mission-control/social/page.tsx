import { prisma } from "@/lib/prisma";
import SocialLinksForm from "@/components/SocialLinksForm";

export default async function SocialPage() {
    const links = await prisma.socialLink.findMany({
        orderBy: { order: 'asc' }
    });

    return (
        <div>
            <h1 style={{ fontFamily: 'var(--font-sans)', fontSize: '24px', marginBottom: '30px' }}>Social Links</h1>
            <SocialLinksForm initialLinks={links} />
        </div>
    );
}
