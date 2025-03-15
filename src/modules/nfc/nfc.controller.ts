import { Body, Controller, Get, Post, Query, UseGuards } from '@nestjs/common';
import { NfcService } from './nfc.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('nfc')
export class NfcController {
  constructor(private readonly nfcService: NfcService) {}

  /**
   * Process an NFC tag scan from hardware
   */
  @Post('process-tag')
  async processTag(@Body() tagData: { tagId: string }) {
    return this.nfcService.processTag(tagData.tagId);
  }

  /**
   * Check NFC API health
   */
  @Get('health')
  async checkHealth() {
    return { status: 'ok', message: 'NFC API is healthy' };
  }

  /**
   * Assign NFC tag to a runner
   */
  @UseGuards(JwtAuthGuard)
  @Post('assign-tag')
  async assignTagToRunner(@Body() assignData: { tagId: string, runnerId: number }) {
    return this.nfcService.assignTagToRunner(assignData.tagId, assignData.runnerId);
  }

  /**
   * Unassign NFC tag from a runner
   */
  @UseGuards(JwtAuthGuard)
  @Post('unassign-tag')
  async unassignTagFromRunner(@Body() unassignData: { runnerId: number }) {
    return this.nfcService.unassignTagFromRunner(unassignData.runnerId);
  }

  /**
   * Get all unassigned NFC tags
   */
  @UseGuards(JwtAuthGuard)
  @Get('unassigned-tags')
  async getUnassignedTags() {
    return this.nfcService.getUnassignedTags();
  }
  
  /**
   * Get NFC log history with optional limit
   */
  @UseGuards(JwtAuthGuard)
  @Get('logs')
  async getNfcLogs(@Query('limit') limit?: number) {
    return this.nfcService.getAllLogs(limit);
  }
}

