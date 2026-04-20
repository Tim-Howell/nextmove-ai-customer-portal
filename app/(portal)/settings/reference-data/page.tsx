import { getReferenceValues } from "@/app/actions/reference";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ReferenceValueTable } from "@/components/settings/reference-value-table";
import { AddReferenceValueButton } from "@/components/settings/add-reference-value-button";
import { referenceTypeLabels, referenceValueTypes } from "@/lib/validations/reference";

export default async function ReferenceDataPage() {
  const allValues = await getReferenceValues();

  const groupedValues = referenceValueTypes.reduce(
    (acc, type) => {
      acc[type] = allValues.filter((v) => v.type === type);
      return acc;
    },
    {} as Record<string, typeof allValues>
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Reference Data</h2>
          <p className="text-muted-foreground">
            Manage dropdown values used throughout the system
          </p>
        </div>
        <AddReferenceValueButton />
      </div>

      {referenceValueTypes.map((type) => (
        <Card key={type}>
          <CardHeader>
            <CardTitle>{referenceTypeLabels[type]}</CardTitle>
          </CardHeader>
          <CardContent>
            <ReferenceValueTable
              values={groupedValues[type] || []}
              type={type}
            />
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
