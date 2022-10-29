import { SchemaComponentOptions } from '@nocobase/client';
import React from 'react';
import { ExportActionInitializer, ExportDesigner, ExportInitializerProvider, useExportAction } from './';

export const ExportPluginProvider = (props: any) => {
  return (
    <SchemaComponentOptions components={{ ExportActionInitializer, ExportDesigner }} scope={{ useExportAction }}>
      <ExportInitializerProvider>{props.children}</ExportInitializerProvider>
    </SchemaComponentOptions>
  );
};
