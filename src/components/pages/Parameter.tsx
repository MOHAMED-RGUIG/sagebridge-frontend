"use client";

import { useMemo } from "react";
import { useGetStockQuery } from "@/lib/api/baseApi";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { stockActions } from "@/features/stock/stockSlice";
import { Card, CardContent, CardHeader } from "@/components/ui/Card";
import Input from "@/components/ui/Input";
import Select from "@/components/ui/Select";
import Badge from "@/components/ui/Badge";

export default function ParameterView() {
  const dispatch = useAppDispatch();
  const query = useAppSelector((s) => s.stock.query);

  const { data, isFetching, isError } = useGetStockQuery(
    { q: query.q || undefined, site: query.site || undefined },
    {
      // Pendant le dev, on peut laisser refetch; en prod, adapter.
      refetchOnFocus: false,
      refetchOnReconnect: true,
    }
  );

  const rows = useMemo(() => data ?? [], [data]);

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader
          title=""
          subtitle=""
          right={
            <div className="flex items-center gap-2">
              <Badge tone={isError ? "red" : isFetching ? "amber" : "green"}>
                {isError ? "Erreur" : isFetching ? "Chargement" : "OK"}
              </Badge>
              <Badge tone="slate">{rows.length} ligne(s)</Badge>
            </div>
          }
        />
    
      </Card>
    </div>
  );
}
