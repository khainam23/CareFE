/**
 * Support API Endpoints Test Utility
 * This file provides a simple way to test all support API endpoints
 * Run this in the browser console after logging in as a support user
 */

import { supportService } from '../services/supportService';

export const testSupportEndpoints = async () => {
  const results = {
    passed: [],
    failed: [],
  };

  console.log('🧪 Starting Support API Endpoints Test...\n');

  // Test 1: Get All Tickets
  try {
    console.log('Testing: GET /api/support/tickets');
    const response = await supportService.getTickets();
    if (response.success) {
      results.passed.push('✅ GET /api/support/tickets');
      console.log('✅ Success:', response.message);
    } else {
      results.failed.push('❌ GET /api/support/tickets');
      console.log('❌ Failed:', response.message);
    }
  } catch (error) {
    results.failed.push('❌ GET /api/support/tickets');
    console.log('❌ Error:', error);
  }

  // Test 2: Get Unassigned Tickets
  try {
    console.log('\nTesting: GET /api/support/tickets/unassigned');
    const response = await supportService.getUnassignedTickets();
    if (response.success) {
      results.passed.push('✅ GET /api/support/tickets/unassigned');
      console.log('✅ Success:', response.message);
    } else {
      results.failed.push('❌ GET /api/support/tickets/unassigned');
      console.log('❌ Failed:', response.message);
    }
  } catch (error) {
    results.failed.push('❌ GET /api/support/tickets/unassigned');
    console.log('❌ Error:', error);
  }

  // Test 3: Get Assigned Tickets
  try {
    console.log('\nTesting: GET /api/support/tickets/assigned');
    const response = await supportService.getAssignedTickets();
    if (response.success) {
      results.passed.push('✅ GET /api/support/tickets/assigned');
      console.log('✅ Success:', response.message);
    } else {
      results.failed.push('❌ GET /api/support/tickets/assigned');
      console.log('❌ Failed:', response.message);
    }
  } catch (error) {
    results.failed.push('❌ GET /api/support/tickets/assigned');
    console.log('❌ Error:', error);
  }

  // Test 4: Get Ticket By ID (if tickets exist)
  try {
    const ticketsResponse = await supportService.getTickets();
    if (ticketsResponse.success && ticketsResponse.data.length > 0) {
      const ticketId = ticketsResponse.data[0].id;
      console.log(`\nTesting: GET /api/support/tickets/${ticketId}`);
      const response = await supportService.getTicketById(ticketId);
      if (response.success) {
        results.passed.push('✅ GET /api/support/tickets/:id');
        console.log('✅ Success:', response.message);
      } else {
        results.failed.push('❌ GET /api/support/tickets/:id');
        console.log('❌ Failed:', response.message);
      }
    } else {
      console.log('\n⚠️  Skipping GET /api/support/tickets/:id - No tickets available');
    }
  } catch (error) {
    results.failed.push('❌ GET /api/support/tickets/:id');
    console.log('❌ Error:', error);
  }

  // Summary
  console.log('\n' + '='.repeat(50));
  console.log('📊 Test Summary:');
  console.log(`✅ Passed: ${results.passed.length}`);
  console.log(`❌ Failed: ${results.failed.length}`);
  console.log('='.repeat(50));

  if (results.passed.length > 0) {
    console.log('\n✅ Passed Tests:');
    results.passed.forEach(test => console.log(`  ${test}`));
  }

  if (results.failed.length > 0) {
    console.log('\n❌ Failed Tests:');
    results.failed.forEach(test => console.log(`  ${test}`));
  }

  return results;
};

// Export individual test functions for manual testing
export const testGetAllTickets = () => supportService.getTickets();
export const testGetUnassignedTickets = () => supportService.getUnassignedTickets();
export const testGetAssignedTickets = () => supportService.getAssignedTickets();
export const testGetTicketById = (id) => supportService.getTicketById(id);
export const testAssignTicket = (id) => supportService.assignTicket(id);
export const testUpdateTicketStatus = (id, status) => supportService.updateTicketStatus(id, status);
export const testResolveTicket = (id, resolution) => supportService.resolveTicket(id, resolution);
export const testEscalateTicket = (id) => supportService.escalateTicket(id);
