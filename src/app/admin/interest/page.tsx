import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import { getCoursesWithObservers } from "@/services/course-services"

export default async function InterestPage() {
    const courses= await getCoursesWithObservers()
    return (
        <div className="max-w-xl mx-auto w-full">
            <p className="text-2xl font-bold text-center mb-4">Interesados</p>
            <div>
                {courses.map((course) => (
                    <Accordion key={course.label} type="single" collapsible>
                        <AccordionItem value={course.label}>
                            <AccordionTrigger>{course.label + " (" + course.users.length + ")"}</AccordionTrigger>
                            <AccordionContent>
                                { course.users.length === 0 ? "Aún no hay interesados" :
                                course.users.map((observer) => (
                                    <li key={observer.email}>
                                        {observer.email} {observer.name ? `- ${observer.name}` : ""}
                                    </li>
                                ))}
                            </AccordionContent>
                        </AccordionItem>
                    </Accordion>
                ))}
            </div>
        </div>
    )
}