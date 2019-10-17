import { tsx, create } from "@dojo/framework/core/vdom";

import Grid from "@dojo/widgets/grid";
import { ColumnConfig } from "@dojo/widgets/grid/interfaces";
import { createFetcher } from "@dojo/widgets/grid/utils";

import { createData } from "./data";
import * as css from "./CustomSortRenderer.m.css";

const columnConfig: ColumnConfig[] = [
  {
    id: "id",
    title: "ID"
  },
  {
    id: "firstName",
    title: "First Name",
    sortable: true
  },
  {
    id: "lastName",
    title: "Last Name",
    sortable: true
  }
];

const fetcher = createFetcher(createData());
const factory = create();

export default factory(() => {
    return (
          <Grid
            fetcher={fetcher}
            columnConfig={columnConfig}
            height={450}
            customRenderers={{
              sortRenderer: (
                columnConfig: ColumnConfig,
                direction?: "asc" | "desc"
              ) => {
                let classes = [css.sort, "fa", "fa-sort"];
                if (direction === "asc") {
                  classes = [css.sort, "fa", "fa-sort-amount-asc"];
                } else if (direction === "desc") {
                  classes = [css.sort, "fa", "fa-sort-amount-desc"];
                }
                return <i classes={classes} />;
              }
            }}
          />
      );
});