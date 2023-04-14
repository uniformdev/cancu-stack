import React, { useEffect, useState } from 'react';
import _ from 'lodash';
import ProductsList from './ProductGrid';

type ProductSearchProps = {
  filters: {
    name: string;
    label?: string;
    taxons: any[];
  }[];
  cms: string;
  lang?: string;
};

const ProductSearch = ({ filters }: ProductSearchProps) => {
  const [on, setOn] = useState<Record<string, number>>({ '0': 0 });
  const [currentProducts, setCurrentProducts] = useState([]);
  useEffect(() => {
    if (!_.isEmpty(filters)) {
      _.map(on, (v, k: number) => {
        setCurrentProducts(filters[k].taxons[v].products || []);
      });
    }
  }, [on, filters]);
  const facets = filters?.map((t, k) => {
    const taxonCard = t.taxons.map((taxon, i) => {
      const { name, products, label } = taxon;
      const pQuantity = products?.length || 0;
      const initialName = label || name;
      const checkedKey = { [`${k}`]: i };
      const checked = on[`${k}`] === i;
      const disabled = pQuantity === 0;
      return (
        <li key={i}>
          {/* <!-- On: "bg-indigo-50 border-indigo-200 z-10", Off: "border-gray-200" --> */}
          <div
            className={`${checked ? `bg-blue-50 border-blue-200 z-10` : 'border-gray-200'} ${
              disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'
            } border rounded-md p-4 my-1`}
            onClick={() => !disabled && setOn(checkedKey)}
          >
            <label
              className={`${
                disabled ? 'cursor-not-allowed' : 'cursor-pointer'
              } flex items-center text-sm justify-between`}
            >
              <span className="ml-3 font-medium text-sm text-gray-900 flex-grow">{initialName}</span>
              <span
                className={`${
                  checked ? 'bg-gray-900 text-gray-50' : 'bg-gray-100 text-gray-600'
                } ml-2 inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium leading-5`}
              >
                {pQuantity}
              </span>
            </label>
          </div>
        </li>
      );
    });
    return (
      <div className="my-4" key={k}>
        <h2 className="text-gray-500 text-xs font-medium uppercase tracking-wide mb-4">{t?.label || t.name}</h2>
        <fieldset>
          <legend className="sr-only">Taxon</legend>
          <ul className=" bg-white rounded-md -space-y-px">{taxonCard}</ul>
        </fieldset>
      </div>
    );
  });
  return (
    <div className="px-3 lg:px-0 container mx-auto max-w-screen-lg flex flex-wrap sm:flex-nowrap">
      <div className="flex-shrink md:flex-shrink-0 md:pr-4 w-full sm:w-auto">{facets}</div>
      <div className="w-full mt-6">
        <ProductsList products={currentProducts} />
      </div>
    </div>
  );
};

export default ProductSearch;