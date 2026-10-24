import AboutSection from '@/Components/Home/AboutSection';
import ContactSection from '@/Components/Home/ContactSection';
import HeroSection from '@/Components/Home/HeroSection';
import ProcessSection from '@/Components/Home/ProcessSection';
import ServicesSection from '@/Components/Home/ServicesSection';
import MarketingLayout from '@/Layouts/MarketingLayout';
import { Head } from '@inertiajs/react';

type HomeProps = {
    about_images: string[];
    hero_image: string;
};

export default function Home({ about_images, hero_image }: HomeProps) {
    return (
        <MarketingLayout>
            <Head title="IT-студия">
                <meta
                    head-key="description"
                    name="description"
                    content="CodeNebula — сайты, приложения и игры на Unreal Engine 5. Чистый код, адаптивный дизайн, прозрачный процесс."
                />
            </Head>
            <HeroSection hero_image={hero_image} />
            <ServicesSection />
            <AboutSection about_images={about_images} />
            <ProcessSection />
            <ContactSection />
        </MarketingLayout>
    );
}
