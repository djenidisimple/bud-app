-- SQLite
SELECT depenses.id, depenses.nameDepence, SUM(Prendres.prix) as Prix , Prendres.created_at as date
FROM Details 
INNER JOIN Prendres ON Details.id = Prendres.detail_id 
INNER JOIN depenses ON Details.depense_id = depenses.id GROUP BY depenses.id;

SELECT ressources.id, ressources.origine, (ressources.prix - COALESCE(SUM(prendres.prix), 0)) as reste
FROM ressources 
LEFT JOIN prendres ON prendres.ressource_id = ressources.id
WHERE prendres.ressource_id = 1 AND ressources.project_id = 1;

SELECT Details.id, Details.nameDetail , SUM(Prendres.prix) as Prix , Prendres.created_at as date
FROM Details 
INNER JOIN Prendres ON Details.id = Prendres.detail_id 
INNER JOIN depenses ON Details.depense_id = depenses.id
WHERE Depenses.project_id = 1 GROUP BY Details.id;

SELECT SUM(ressources.prix) as prix 
FROM ressources;  

SELECT (SUM(ressources.prix) - (SELECT SUM(Prendres.prix) 
   FROM Details INNER JOIN Prendres ON Details.id = Prendres.detail_id)) AS valeurRestons
FROM ressources;  

SELECT prendres.id, prendres.prix as prix, ressources.prix as price , prendres.created_at as date
FROM prendres INNER JOIN ressources ON ressources.id = prendres.ressource_id GROUP BY ressource_id;
