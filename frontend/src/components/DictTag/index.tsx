/* eslint-disable array-callback-return */
import { IdictType } from '@/type/modules/system/sysDictData';
import React from 'react';
import { Tag } from 'antd';

export type AddEditFormProps = {
  options: IdictType[];
  value: string;
};
const DictTag: React.FC<AddEditFormProps> = (props) => {
  const { options, value } = props;

  return (
    <div>
      {options.map((option) => {
        if (option.dictValue === value) {
          return option.listClass === 'empty' || option.listClass === '' ? (
            <span key={option.dictValue} className={option.cssClass}>
              {option.dictLabel}
            </span>
          ) : (
            <Tag key={option.dictValue} style={{ marginRight: 0 }} color={option.listClass} className={option.cssClass}>
              {option.dictLabel}
            </Tag>
          );
        }
      })}
    </div>
  );
};

export default DictTag;
