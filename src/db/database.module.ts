import { Module } from '@nestjs/common';
import { databaseProviders } from './database.providers';
import { Injectable, Inject } from '@nestjs/common';

@Module({
  providers: [...databaseProviders],
  exports: [...databaseProviders],
})

export class DatabaseModule {

}
