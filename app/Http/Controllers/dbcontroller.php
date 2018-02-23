<?php

namespace App\Http\Controllers;
use DB;
use Illuminate\Support\Facades\Input;
use Illuminate\Http\Request;

class dbcontroller extends Controller
{
  protected $GetChannelGroups = array();
  protected $GetPeriodRanges = array();
  protected $GetChannelPerformance = array();
  protected $GetProgramePerformance = array();
  protected $GetTrending = array();
  protected $ProgrammeTitles = array();
  protected $numbersToTake = 0;

  public function __construct(){
    $this->GetChannelGroups = DB::select('EXEC GetChannelGroups');
    $this->GetPeriodRanges = DB::select('EXEC GetPeriodRanges');
  }

  public function GetChannelGroups(){
    return response($this->GetChannelGroups);
  }

  public function GetPeriodRanges(){
    return response($this->GetPeriodRanges);
  }

  public function GetChannelPerformance(Request $r){
    $this->GetChannelPerformance = DB::select('EXEC GetChannelPerformance ?, ?, ?, ?',array($r->ChannelGroupID,$r->PeriodTypeID,$r->Period,$r->Filter));
    return response($this->GetChannelPerformance);
  }

  public function GetProgramePerformance(Request $r){    
    $this->GetProgramePerformance = DB::select('EXEC GetProgramePerformance ?, ?, ?, ?, ?, ?, ?',array($r->ChannelGroupID,$r->ChannelID,$r->PlatFormID,$r->PeriodTypeID,$r->Period,$r->Filter,$r->InputSortID));        
    $page = Input::get('page', $r->page);
    $paginate = 1000;
    $data = $this->GetProgramePerformance;
    $offSet = ($page * $paginate) - $paginate;
    $itemsForCurrentPage = array_slice($data, $offSet, $paginate, true);
    $data = new \Illuminate\Pagination\LengthAwarePaginator($itemsForCurrentPage, count($data), $paginate, $page);

    return compact('data');
  }

  public function GetTrending(Request $r){
    $this->GetTrending = DB::select('EXEC GetTrending ?, ?, ?, ?, ?, ?, ?',array($r->ProgTitleID,$r->ChannelGroupID,$r->ChannelID,$r->PeriodTypeID,$r->Period,$r->PlatFormID,$r->Filter));
    return response($this->GetTrending);
  }

  public function BMITitles(Request $r){
    $this->ProgrammeTitles = DB::select('EXEC QueryBMIProgramTitles ?',array($r->InputFilter));
    return response($this->ProgrammeTitles);
  }
  public function ExpotChannelPerformance(Request $r){    
    $this->GetChannelPerformance = DB::select('EXEC GetChannelPerformance ?, ?, ?, ?',array($r->ChannelGroupID,$r->PeriodTypeID,$r->Period,$r->Filter));    
    return response($this->GetChannelPerformance);
  }

  public function exportprogramme(Request $r){
    $currentdatetime = date('Ymdhis');
    $this->GetProgramePerformance = DB::select('EXEC GetProgramePerformance ?, ?, ?, ?, ?, ?, ?',array($r->ChannelGroupID,$r->ChannelID,$r->PlatFormID,$r->PeriodTypeID,$r->Period,$r->Filter,$r->InputSortID));
    return response($this->GetProgramePerformance);
  }
  public function exporttrending(Request $r){
    $currentdatetime = date('Ymdhis');
    $this->GetTrending = DB::select('EXEC GetTrending ?, ?, ?, ?, ?, ?, ?',array($r->ProgTitleID,$r->ChannelGroupID,$r->ChannelID,$r->PeriodTypeID,$r->Period,$r->PlatFormID,$r->Filter));
    return response($this->GetTrending);
  }
  public function uploadimg(Request $r){
    $data = 'data:image/png;base64,AAAFBfj42Pj4';

    list($type, $data) = explode(';', $data);
    list(, $data)      = explode(',', $data);
    $data = base64_decode($data);

    file_put_contents('chart/image.png', $data);
  }
  public function export_items_to_excel(Request $r){
        
    $data = base64_decode(preg_replace('#^data:image/\w+;base64,#i', '', $r->img));
    $datetoday = date("Ymd H:i:s");
    $filename = 'chart.png'. $datetoday;
    list($type, $data) = explode(';', $data);
    list(, $data)      = explode(',', $data);
    $data = base64_decode($data);

    if (preg_match('/^data:image\/(\w+);base64,/', $data, $type)) {
        $data = substr($data, strpos($data, ',') + 1);
        $type = strtolower($type[1]); // jpg, png, gif

        if (!in_array($type, [ 'jpg', 'jpeg', 'gif', 'png' ])) {
            throw new \Exception('invalid image type');
        }

        $data = base64_decode($data);

        if ($data === false) {
            throw new \Exception('base64_decode failed');
        }
    } else {
        throw new \Exception('did not match data URI with image data');
    }

    file_put_contents("img.{$type}", $data);
  }    
}
